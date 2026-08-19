import { ApiResponse } from '../types';

export interface GasRequestOptions {
  method?: 'GET' | 'POST';
  action: string;
  data?: any;
  token?: string;
  timeoutMs?: number;
}

export async function callGasApi<T = any>(
  apiUrl: string,
  options: GasRequestOptions
): Promise<ApiResponse<T>> {
  const { method = 'POST', action, data = {}, token, timeoutMs = 35000 } = options;

  if (!apiUrl || apiUrl.trim() === '') {
    return {
      success: false,
      message: 'Google Apps Script API URL is not configured.',
      errorCode: 'API_URL_MISSING',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let url = apiUrl.trim();
    let fetchOptions: RequestInit = {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    };

    if (method === 'GET') {
      const params = new URLSearchParams({
        action,
        ...(token ? { token } : {}),
        ...Object.entries(data || {}).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null) {
            acc[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
          }
          return acc;
        }, {} as Record<string, string>),
      });

      url = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
      fetchOptions.method = 'GET';
    } else {
      // POST payload
      const payload = {
        action,
        token,
        data,
        timestamp: new Date().toISOString(),
      };

      fetchOptions = {
        ...fetchOptions,
        method: 'POST',
        // Using text/plain prevents unnecessary CORS preflight blocks in certain Google Apps Script environments
        // while allowing Apps Script e.postData.contents to receive full JSON payload.
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      };
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        message: `Server responded with HTTP error status: ${response.status}`,
        errorCode: `HTTP_${response.status}`,
      };
    }

    const rawText = await response.text();
    let responseJson: ApiResponse<T>;
    try {
      responseJson = JSON.parse(rawText);
    } catch (parseErr) {
      if (rawText.includes('Sorry, unable to open the file') || rawText.includes('Page not found') || rawText.includes('Google Drive')) {
        return {
          success: false,
          message: 'Google Web App access error: Please verify your Google Apps Script Web App deployment settings ("Who has access: Anyone") or check if you got a new Web App URL.',
          errorCode: 'GAS_DEPLOYMENT_ERROR',
        };
      }
      return {
        success: false,
        message: 'Invalid response received from Google Apps Script backend.',
        errorCode: 'INVALID_JSON',
      };
    }
    return responseJson;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timed out connecting to Google Apps Script. Please verify your Web App deployment URL and internet connection.',
        errorCode: 'TIMEOUT',
      };
    }
    return {
      success: false,
      message: error?.message || 'Failed to connect to the backend server.',
      errorCode: 'NETWORK_ERROR',
    };
  }
}

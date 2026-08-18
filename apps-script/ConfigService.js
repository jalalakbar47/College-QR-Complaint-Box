/**
 * ==============================================================================
 * College QR Complaint Box - Categories & Locations Configuration (CRUD)
 * ==============================================================================
 */

const ConfigService = {
  getCategories: function () {
    const categories = Database.readAll(Database.SHEETS.CATEGORIES);
    return { success: true, data: categories };
  },

  saveCategory: function (payload) {
    const sheetName = Database.SHEETS.CATEGORIES;
    const catId = payload.category_id;
    const existing = Database.readAll(sheetName).find(function (c) { return c.category_id === catId; });

    if (existing) {
      Database.updateRow(sheetName, 'category_id', catId, {
        category_name: Security.sanitizeString(payload.category_name),
        description: Security.sanitizeString(payload.description),
        status: payload.status || 'Active',
      });
      return { success: true, message: 'Category updated successfully.' };
    } else {
      const newId = catId || ('CAT-' + Math.floor(1000 + Math.random() * 9000));
      Database.appendRow(sheetName, Database.CATEGORY_HEADERS, {
        category_id: newId,
        category_name: Security.sanitizeString(payload.category_name),
        description: Security.sanitizeString(payload.description),
        status: payload.status || 'Active',
      });
      return { success: true, message: 'Category created successfully.', data: { category_id: newId } };
    }
  },

  deleteCategory: function (categoryId) {
    const success = Database.deleteRow(Database.SHEETS.CATEGORIES, 'category_id', categoryId);
    return { success: success, message: success ? 'Category deleted.' : 'Category not found.' };
  },

  getLocations: function () {
    const locations = Database.readAll(Database.SHEETS.LOCATIONS);
    return { success: true, data: locations };
  },

  saveLocation: function (payload) {
    const sheetName = Database.SHEETS.LOCATIONS;
    const locId = payload.location_id;
    const existing = Database.readAll(sheetName).find(function (l) { return l.location_id === locId; });

    if (existing) {
      Database.updateRow(sheetName, 'location_id', locId, {
        location_name: Security.sanitizeString(payload.location_name),
        status: payload.status || 'Active',
      });
      return { success: true, message: 'Location updated successfully.' };
    } else {
      const newId = locId || ('LOC-' + Math.floor(1000 + Math.random() * 9000));
      Database.appendRow(sheetName, Database.LOCATION_HEADERS, {
        location_id: newId,
        location_name: Security.sanitizeString(payload.location_name),
        status: payload.status || 'Active',
      });
      return { success: true, message: 'Location created successfully.', data: { location_id: newId } };
    }
  },

  deleteLocation: function (locationId) {
    const success = Database.deleteRow(Database.SHEETS.LOCATIONS, 'location_id', locationId);
    return { success: success, message: success ? 'Location deleted.' : 'Location not found.' };
  },
};

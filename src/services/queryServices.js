// queryServices.js
import axios from 'axios';

export async function fetchTableNames() {
  try {
    const response = await axios.get('/api/tables');

    if (response.status !== 200) {
      throw new Error('Failed to fetch table names');
    }

    return response.data;
  } catch (error) {
    throw new Error('Error fetching table names. Please try again.');
  }
}

export async function executeCustomQuery(query) {
  try {
    const response = await axios.post('/api/custom-query', {
      query,
    });

    if (response.status !== 200) {
      throw new Error('Failed to execute your query');
    }

    return { data: response.data };
  } catch (error) {
    return { error: error.message };
  }
}

export async function fetchTableColumns(tableName) {
  if (!tableName) {
    throw new Error(
      'Could not fetch tables columns from your database. Missing name. Please try again.'
    );
  }

  try {
    const response = await axios.get(`/api/columns?tableName=${tableName}`);

    if (response.status !== 200) {
      throw new Error('Failed to fetch table information');
    }

    return response.data;
  } catch (error) {
    throw new Error('Error fetching table information. Please try again.');
  }
}

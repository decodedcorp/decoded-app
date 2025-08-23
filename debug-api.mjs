// Quick test to check the actual API response structure
fetch('http://localhost:3001/api/proxy/contents/channel/688a317213dbcfcd941c85b4?skip=0&limit=20')
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    return response.json();
  })
  .then(data => {
    console.log('Response data structure:', JSON.stringify(data, null, 2));
    console.log('Data keys:', Object.keys(data));
    if (data.contents) {
      console.log('Contents length:', data.contents.length);
      console.log('First content:', data.contents[0]);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
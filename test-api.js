// Simple test to check if the API is working
async function testAPI() {
  try {
    // Test ping endpoint
    console.log("Testing ping endpoint...");
    const pingResponse = await fetch("http://localhost:8080/api/ping");
    const pingResult = await pingResponse.json();
    console.log("Ping result:", pingResult);

    // Test requests endpoint with a dummy user ID
    console.log("Testing requests endpoint...");
    const requestsResponse = await fetch("http://localhost:8080/api/requests", {
      headers: {
        "X-User-Id": "test-user-id",
      },
    });
    console.log("Requests response status:", requestsResponse.status);

    if (requestsResponse.ok) {
      const requestsResult = await requestsResponse.json();
      console.log("Requests result:", requestsResult);
    } else {
      const errorText = await requestsResponse.text();
      console.log("Requests error:", errorText);
    }
  } catch (error) {
    console.error("API test failed:", error);
  }
}

testAPI();

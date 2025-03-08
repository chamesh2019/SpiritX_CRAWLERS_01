export function Home() {
  let key = localStorage.getItem("token");
  if (!key) {
    window.location.href = "/login";
  } else {
    fetch("/checkkey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: key }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.valid) {
          document.getElementById("content").innerText =
            "Redirecting to login page...";
          // localStorage.removeItem("token");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        } else {
            document.querySelector("button")?.classList.remove("hidden");
          document.getElementById("content").innerText =
            data.username + "! Welcome to the home page! You are logged in.";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        window.location.href = "/login";
      });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p id="content" className="text-lg"></p><br />
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg hidden"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>{" "}
    </div>
  );
}

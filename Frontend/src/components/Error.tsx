'use client'
export default function Error() {
    const redirectToHomePage = () => {
      window.location.href = "/";
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen text-black">
        <div className="error-page text-center">
          <div className="oops text-3xl font-bold mb-4">Oops!</div>
          <div className="message text-lg">Something went wrong...</div>
          <div>
            <button
              className="retry-button mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={redirectToHomePage}
            >
              🏠 Back to home!
            </button>
          </div>
        </div>
      </div>
    );
  }
  
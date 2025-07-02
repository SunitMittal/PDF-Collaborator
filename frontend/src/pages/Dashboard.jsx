import { useEffect, useState } from "react";
import { getUserPDFs, sharePDF } from "../api/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!token) return navigate("/");

    const fetchPDFs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getUserPDFs(token);
        setPdfs(res.data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setError("Failed to load PDFs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPDFs();
  }, [navigate, token]);

  const handleShare = async (pdfId, fileName) => {
    const emails = prompt("Enter emails (comma-separated) to share:");
    if (!emails) return;

    try {
      const res = await sharePDF({ pdfId, emails: emails.split(",") }, token);
      alert(`PDF Shared! Link: ${res.data.link}`);
    } catch (error) {
      console.error("Error sharing PDF", error);
    }
  };

  const filteredPDFs = pdfs.filter(pdf => 
    pdf.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Document Hub</h1>
              <p className="mt-2 text-gray-600">Manage and share your PDF documents</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-900">{userEmail}</p>
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search your documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-40"
            />
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="block w-40 rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-40"
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          <button
            onClick={() => navigate("/upload")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload PDF
          </button>
        </div>

        {/* Main Content */}
        <main>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-blue-200"></div>
                <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="ml-3 text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          ) : filteredPDFs.length === 0 ? (
            <div className="mx-auto max-w-md text-center">
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12">
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {searchQuery ? "No matching PDFs" : "No PDFs uploaded yet"}
                </h3>
                <p className="mb-6 text-gray-500">
                  {searchQuery ? "Try a different search term" : "Upload your first PDF to get started"}
                </p>
                <button
                  onClick={() => navigate("/upload")}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Upload Your First PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPDFs.map((pdf) => (
                <div
                  key={pdf._id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:border-blue-200"
                >
                  <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-blue-600 p-3 shadow-lg">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 truncate text-lg font-semibold text-gray-900">
                      {pdf.fileName}
                    </h3>
                    <p className="mb-4 text-sm text-gray-500">
                      Shared with {pdf.sharedWith.length} {pdf.sharedWith.length === 1 ? 'person' : 'people'}
                    </p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => navigate(`/view/${pdf._id}`)}
                        className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleShare(pdf._id, pdf.fileName)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors duration-200"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
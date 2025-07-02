import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedPDF, getComments, addComment } from "../api/api";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Import worker directly
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const ViewPDF = () => {
  const { pdfId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);

  const cleanPdfId = pdfId.split("-")[0];
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        console.log("🔹 Fetching PDF with ID:", cleanPdfId);
        const res = await getSharedPDF(cleanPdfId);
        if (!res.data || !res.data.pdf)
          throw new Error("Invalid PDF data received");
        if (!res.data.pdf.fileUrl) throw new Error("PDF URL is missing");

        console.log("✅ PDF URL:", res.data.pdf.fileUrl);
        setPdfUrl(res.data.pdf.fileUrl);
      } catch (error) {
        console.error("❌ Error fetching PDF:", error);
        setError(error.message || "Failed to load PDF.");
      }
    };

    const fetchComments = async () => {
      try {
        console.log("🔹 Fetching Comments for ID:", cleanPdfId);
        const res = await getComments(cleanPdfId);
        setComments(res.data.comments);
      } catch (error) {
        console.error("❌ Error fetching comments:", error);
      }
    };

    fetchPDF();
    fetchComments();
  }, [cleanPdfId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");

      const commentData = {
        pdfId: cleanPdfId,
        text: newComment,
        email: userEmail,
      };

      const res = await addComment(commentData);
      setComments((prevComments) => [res.data.comment, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("❌ Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setScale(1.0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* PDF Viewer Section */}
          <div className="lg:w-2/3">
            <div className="sticky top-4 rounded-2xl border border-gray-200/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl transition-all">
              {error ? (
                <div className="rounded-xl bg-red-50 p-6 text-red-600">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-semibold">Error: {error}</p>
                  </div>
                  <p className="mt-2 text-sm">
                    Please check if the link is valid or try again later.
                  </p>
                </div>
              ) : pdfUrl ? (
                <>
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Document Viewer</h2>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Zoom Controls */}
                      <div className="flex items-center rounded-lg bg-gray-100 p-1">
                        <button
                          onClick={handleZoomOut}
                          className="rounded-lg p-2 text-gray-600 hover:bg-white hover:shadow-sm"
                          title="Zoom Out"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                          </svg>
                        </button>
                        <button
                          onClick={handleResetZoom}
                          className="rounded-lg px-2 py-1 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm"
                        >
                          {Math.round(scale * 100)}%
                        </button>
                        <button
                          onClick={handleZoomIn}
                          className="rounded-lg p-2 text-gray-600 hover:bg-white hover:shadow-sm"
                          title="Zoom In"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                          </svg>
                        </button>
                      </div>
                      
                      {/* Page Navigation */}
                      <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-50"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                          </svg>
                          Previous
                        </button>
                        <span className="px-2 text-sm font-medium text-gray-600">
                          {currentPage} / {numPages || '?'}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
                          disabled={currentPage === numPages}
                          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-50"
                        >
                          Next
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-gray-200/60 bg-gray-50 shadow-inner">
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={({ numPages }) => {
                        console.log("PDF loaded successfully with", numPages, "pages");
                        setNumPages(numPages);
                      }}
                      onLoadError={(error) => {
                        console.error("Detailed PDF Load Error:", error);
                        setError(`Failed to load PDF: ${error.message}`);
                      }}
                      loading={
                        <div className="flex h-96 items-center justify-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                            <p className="text-sm font-medium text-gray-600">Loading PDF...</p>
                          </div>
                        </div>
                      }
                    >
                      <Page
                        pageNumber={currentPage}
                        scale={scale}
                        className="mx-auto max-w-full"
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                  </div>
                </>
              ) : (
                <div className="flex h-96 items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-sm font-medium text-gray-600">Loading PDF...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="lg:w-1/3">
            <div className="sticky top-4 rounded-2xl border border-gray-200/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl transition-all">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Comments ({comments.length})
              </h2>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="group relative rounded-xl border border-gray-200 bg-white transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <textarea
                    placeholder="Share your thoughts..."
                    className="w-full resize-none rounded-xl border-0 bg-transparent px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
                    rows="4"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="absolute bottom-2 right-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isCommenting}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCommenting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Comment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {comments.map((comment, index) => (
                  <div
                    key={comment._id || index}
                    className="group relative rounded-xl bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          {comment.user[0].toUpperCase()}
                        </div>
                        <span
                          className={`font-medium ${
                            comment.user === localStorage.getItem("userEmail")
                              ? "text-blue-600"
                              : "text-gray-900"
                          }`}
                        >
                          {comment.user === localStorage.getItem("userEmail")
                            ? "You"
                            : comment.user}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-gray-700">
                      {comment.text}
                    </p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-8">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-2 text-center text-sm text-gray-500">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPDF;
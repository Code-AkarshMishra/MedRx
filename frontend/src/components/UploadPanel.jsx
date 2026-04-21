// import { useState } from "react";
// import { motion } from "framer-motion";
// import { api, setAuthToken } from "../services/api";
// import { STORAGE_KEYS, saveJSON } from "../utils/storage";

// function UploadPanel({ token, onAnalyzed }) {
//   const [isDragging, setIsDragging] = useState(false);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleUpload = async (selectedFile) => {
//     setError("");
//     setFile(selectedFile);
//     const formData = new FormData();
//     formData.append("report", selectedFile);

//     setAuthToken(token || null);
//     setLoading(true);
//     try {
//       const { data } = await api.post("/analyze", formData);
//       saveJSON(STORAGE_KEYS.result, data);
//       onAnalyzed();
//     } catch (err) {
//       const message = err?.response?.data?.message || "Upload failed. Please try again.";
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-full flex-col justify-center rounded-2xl bg-white p-8 shadow-sm">
//       <h2 className="mb-2 text-xl font-bold text-slate-800">Upload Medical Report</h2>
//       <p className="mb-6 text-sm text-slate-500">Drag and drop or choose a JPG, PNG, or PDF.</p>

//       {/* Drag & Drop Zone */}
//       <div
//         className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-200 ease-in-out ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-slate-100"
//           }`}
//         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//         onDragLeave={() => setIsDragging(false)}
//         onDrop={(e) => {
//           e.preventDefault();
//           setIsDragging(false);
//           const droppedFile = e.dataTransfer.files[0];
//           if (droppedFile) {
//             handleUpload(droppedFile);
//           }
//         }}
//       >
//         {/* Animated Icon */}
//         <motion.div
//           animate={isDragging ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
//           className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm group-hover:shadow-md"
//         >
//           <svg className={`h-8 w-8 transition-colors ${isDragging ? "text-blue-600" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//           </svg>
//         </motion.div>

//         <span className="text-base font-semibold text-slate-700">Drop report file here</span>
//         <span className="mt-1 mb-4 text-xs font-medium text-slate-500">or click to browse</span>

//         <label className="cursor-pointer rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800">
//           Browse File
//           <input
//             type="file"
//             className="hidden"
//             accept=".jpg,.jpeg,.png,.pdf"
//             onChange={(e) => {
//               if (e.target.files[0]) {
//                 handleUpload(e.target.files[0]);
//               }
//             }}
//           />
//         </label>
//       </div>

//       {loading && (
//         <div className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-blue-50 p-4 text-sm font-bold text-blue-700">
//           <svg className="h-5 w-5 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//           </svg>
//           Analyzing via AI...
//         </div>
//       )}

//       {file && !loading && (
//         <p className="mt-4 text-xs text-slate-500">Selected: {file.name}</p>
//       )}

//       {error && (
//         <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
//       )}
//     </div>
//   );
// }

// export default UploadPanel;
import { useState } from "react";
import { motion } from "framer-motion";
import { api, setAuthToken } from "../services/api";
import { STORAGE_KEYS, saveJSON } from "../utils/storage";

function UploadPanel({ token, onAnalyzed }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (selectedFile) => {
    setError("");
    setFile(selectedFile);

    const formData = new FormData();
    formData.append("report", selectedFile);

    setAuthToken(token || null);
    setLoading(true);

    try {
      // Send file to backend explicitly setting headers for multipart
      const { data } = await api.post("/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      saveJSON(STORAGE_KEYS.result, data);

      // Pass the data back to PortalPage to trigger the result pop-up!
      onAnalyzed(data);

    } catch (err) {
      const message = err?.response?.data?.message || "Upload failed. Please ensure the backend is running.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-center rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-xl font-bold text-slate-800">Upload Medical Report</h2>
      <p className="mb-6 text-sm text-slate-500">Drag and drop or choose a JPG, PNG, or PDF.</p>

      {/* Drag & Drop Zone */}
      <div
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-200 ease-in-out ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-slate-100"
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) {
            handleUpload(droppedFile);
          }
        }}
      >
        {/* Animated Icon */}
        <motion.div
          animate={isDragging ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm group-hover:shadow-md"
        >
          <svg className={`h-8 w-8 transition-colors ${isDragging ? "text-blue-600" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </motion.div>

        <span className="text-base font-semibold text-slate-700">Drop report file here</span>
        <span className="mt-1 mb-4 text-xs font-medium text-slate-500">or click to browse</span>

        <label className="cursor-pointer rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800">
          Browse File
          <input
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => {
              if (e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>

      {loading && (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl bg-blue-50 p-4 text-sm font-bold text-blue-700">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Analyzing via AI Engine...
          </div>
          <div className="h-1 w-full bg-blue-200 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-blue-600 animate-[pulse_1s_ease-in-out_infinite] w-1/2 rounded-full"></div>
          </div>
        </div>
      )}

      {file && !loading && (
        <p className="mt-4 text-xs font-medium text-green-600 flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Processed: {file.name}
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 font-medium text-center">
          {error}
        </p>
      )}
    </div>
  );
}

export default UploadPanel;
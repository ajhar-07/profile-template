import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";
import temp from "../assets/tempDesign1.png";
import toast, { Toaster } from "react-hot-toast";
import { FaCopy, FaDownload, FaRecycle, FaUpload } from "react-icons/fa";

/* ---------- Helpers ---------- */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

const getCroppedImage = async (imageSrc, cropPixels) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1080;
  canvas.height = 1080;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    1080,
    1080
  );

  return canvas.toDataURL("image/png");
};

/* ---------- Animations ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/* ---------- Component ---------- */
const Home = () => {
  const hashtagText = "#selimuddinforsylhet6 চ্যালেঞ্জে অংশ নিন ...";

  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hashtagText);
    toast.success("হ্যাশট্যাগ কপি হয়েছে");
  };

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageSrc(URL.createObjectURL(file));
    setCroppedImage(null);
  };

  const onCropComplete = useCallback((_, pixels) => {
    setCropPixels(pixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!cropPixels || !imageSrc) return;
    const cropped = await getCroppedImage(imageSrc, cropPixels);
    setCroppedImage(cropped);
  };

  const handleDownload = async () => {
    if (!croppedImage) return;

    toast.success("Profile Downloaded");

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 1080;
    canvas.height = 1080;

    const userImg = await createImage(croppedImage);
    const templateImg = await createImage(temp);

    ctx.clearRect(0, 0, 1080, 1080);
    ctx.drawImage(userImg, 0, 0, 1080, 1080);
    ctx.drawImage(templateImg, 0, 580, 1080, 500);

    const link = document.createElement("a");
    link.download = "facebook-profile.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

const handleChangePhoto = () => {
  setImageSrc(null);
  setCroppedImage(null);
  setCrop({ x: 0, y: 0 });
  setZoom(1);
  setCropPixels(null);

  // file input আবার open করবে
  setTimeout(() => {
    fileRef.current.click();
  }, 0);
};


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-700 flex items-center justify-center px-1 py-6"
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* LEFT SIDE */}
        <div className="space-y-6 order-2 lg:order-1">

          {/* Upload Card */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => !imageSrc && fileRef.current.click()}
            className="bg-white rounded-3xl p-8 shadow-xl cursor-pointer"
          >
            <div className="w-full h-96 border-2 border-dashed border-emerald-300 rounded-2xl relative overflow-hidden">

              {!imageSrc && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <p className="font-medium">আপনার ছবি আপলোড করুন</p>
                  <p className="text-sm text-gray-500 mb-2">
                    PNG, JPG or JPEG (Max 10MB)
                  </p>

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"
                  >
                    <FaUpload className="text-emerald-600 text-3xl" />
                  </motion.div>
                </motion.div>
              )}

              {imageSrc && !croppedImage && (
                <>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />

                  <div className="absolute z-1 bottom-3 left-3 right-3 bg-white rounded-xl p-3">
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full"
                    />
                    <button
                      onClick={handleCropConfirm}
                      className="mt-2 w-full bg-emerald-600 text-white rounded-lg py-1"
                    >
                      Crop Confirm
                    </button>
                  </div>
                </>
              )}

              {croppedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <img
                    src={croppedImage}
                    className="w-full h-full object-cover rounded-2xl"
                    alt=""
                  />
                  <img
                    src={temp}
                    className="absolute mt-[165px] h-[240px] inset-0 w-full rounded-2xl"
                    alt=""
                  />
                </motion.div>
              )}

              <img
                src={temp}
                className="absolute mt-[140px] h-[240px] inset-0 w-full rounded-2xl pointer-events-none"
                alt=""
              />
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="hidden"
            />
          </motion.div>

          {/* Buttons */}
          {croppedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex gap-3"
            >
             <button
  onClick={handleChangePhoto}
  className="flex-1 flex items-center justify-center gap-2
bg-white/80 backdrop-blur
border border-emerald-300
text-emerald-700 font-semibold
py-2.5 px-4 rounded-xl
shadow-md
hover:bg-emerald-50
hover:border-emerald-400
hover:shadow-lg
active:scale-95
transition-all duration-300"
>
  <FaRecycle /> ফটো পরিবর্তন করুন
</button>

              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2
bg-gradient-to-r from-emerald-500 to-teal-600
text-white font-semibold
py-2.5 px-4 rounded-xl
shadow-lg shadow-emerald-500/30
hover:from-emerald-600 hover:to-teal-700
hover:shadow-xl hover:shadow-emerald-600/40
active:scale-95
transition-all duration-300"
              >
                <FaDownload /> ডাউনলোড করুন
              </button>
            </motion.div>
          )}

          {/* Hashtag Card */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 rounded-3xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              এলাকার উন্নয়নের অংশ হোন
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              গোলাপগঞ্জ-বিয়ানীবাজারের তরুণদের জন্য এটি একটি বিশেষ সুযোগ।
            </p>

            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <span className="text-emerald-500 font-bold">#</span>
              <span className="text-emerald-600 text-sm font-medium truncate">
                {hashtagText}
              </span>
              <button
                onClick={handleCopy}
                className="ml-auto flex items-center text-emerald-500 font-medium"
              >
                <FaCopy className="mr-1" /> Copy
              </button>
            </div>
          </motion.div>

          <p className="text-center text-white">
            © SoftEdge Technology Ltd.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white order-1 lg:order-2"
        >
          <h1 className="text-3xl font-bold mb-3">আদম্য তরুণ প্রতিনিধি</h1>

          <p className="text-lg text-emerald-100 mb-6 leading-relaxed">
            মোহাম্মদ সেলিম উদ্দিন এর সাথে কফি আড্ডা এবং গোলাপগঞ্জ-বিয়ানীবাজারের
            বিভিন্ন সমস্যা ও সমাধান নিয়ে আলোচনার সুযোগ পেতে অংশগ্রহণ করুন।
          </p>

          <div className="bg-white/90 text-gray-800 rounded-2xl p-6 space-y-3">
            <h2 className="font-semibold text-lg">🏅 অংশগ্রহণের নিয়মাবলী</h2>
            <div className="bg-gray-100 p-3 rounded-xl">
              ১। ফটো ফ্রেম ব্যবহার করে প্রোফাইল ছবি তৈরি করুন
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              ২। ফেসবুকে পোস্ট করে <b>#selimuddinforsylhet6</b> ব্যবহার করুন
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              ৩। অন্তত দুইজন বন্ধুকে মেনশন করুন
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              ৪। প্রবাসীরাও এই ক্যাম্পেইনে অংশগ্রহণ করতে পারবেন।
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              ৫। ৩০ জন বিজয়ী নির্বাচন করা হবে
            </div>
          </div>
        </motion.div>
      </div>

      <Toaster />
    </motion.div>
  );
};

export default Home;

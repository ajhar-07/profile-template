import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import temp from "../assets/temp.png";
import toast, { Toaster } from "react-hot-toast";
import { FaCopy, FaDownload, FaRecycle } from "react-icons/fa";

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
    toast.success("Profile Downloaded")
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 1080;
    canvas.height = 1080;

    const userImg = await createImage(croppedImage);
    const templateImg = await createImage(temp);

    // User image
    ctx.clearRect(0, 0, 1080, 1080);
    ctx.drawImage(userImg, 0, 0, 1080, 1080);
    // Overlay template
    ctx.drawImage(templateImg, -50, 692, 1200,400);

    const link = document.createElement("a");
    link.download = "facebook-profile.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-700 flex items-center justify-center p-6">
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* Upload Card */}
          <div
            onClick={() => !imageSrc && fileRef.current.click()}
            className="bg-white rounded-3xl p-8 shadow-xl cursor-pointer"
          >
            <div className="w-full h-96 border-2 border-dashed border-emerald-300 rounded-2xl relative overflow-hidden">

              {!imageSrc && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <span className="text-emerald-600 text-3xl">↑</span>
                  </div>
                  <p className="font-medium">আপনার ছবি আপলোড করুন</p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG or JPEG (Max 10MB)
                  </p>
                </div>
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

                  <div className="absolute bottom-3 left-3 right-3 bg-white rounded-xl p-3">
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
                <div className="relative w-full h-full">
                  <img
                    src={croppedImage}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <img
                    src={temp}
                    className="absolute mt-[165px] h-[240px] inset-0 w-full  rounded-2xl"
                  />
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="hidden"
            />
          </div>

          {/* Buttons */}
          {croppedImage && (
            <div className="flex gap-3">
              <button
                onClick={() => fileRef.current.click()}
                className="flex-1 items-center flex justify-around bg-gray-200 rounded-xl py-2 font-medium"
              >
              <FaRecycle/> <span>ফটো পরিবর্তন করুন</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 items-center flex justify-around bg-emerald-600 text-white rounded-xl py-2 font-medium"
              >
                <FaDownload/> <span>ডাউনলোড করুন</span>
              </button>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-white/90 rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              এলাকার উন্নয়নের অংশ হোন
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              বিয়ানীবাজার ও গোলাপগঞ্জের তরুণদের জন্য এটি একটি বিশেষ সুযোগ।
              আপনার মেধা ও উদ্ভাবন দিয়ে গড়ে তুলুন আগামী দিনের সিলেট।
            </p>

            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <span className="text-emerald-500 font-bold">#</span>
              <span className="text-emerald-600 text-sm font-medium truncate">
                {hashtagText}
              </span>
              <button
                onClick={handleCopy}
                className="ml-auto flex items-center text-emerald-500 hover:text-emerald-700 font-medium"
              >
                <FaCopy/>  <span className="ml-1">Copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-3">
            আদম্য তরুণ প্রতিনিধি
          </h1>

          <p className="text-sm text-emerald-100 mb-6 leading-relaxed">
            মোহাম্মদ সেলিম উদ্দিন এর সাথে কফি আড্ডা এবং বিয়ানীবাজার ও গোলাপগঞ্জের
            বিভিন্ন সমস্যা ও সমাধান নিয়ে আলোচনার সুযোগ পেতে অংশগ্রহণ করুন।
          </p>

          <div className="bg-white/90 text-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">🏅 অংশগ্রহণের নিয়মাবলী</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-100 p-3 rounded-xl">
                ১। ফটো ফ্রেম ব্যবহার করে প্রোফাইল ছবি তৈরি করুন
              </div>
              <div className="bg-gray-100 p-3 rounded-xl">
                ২। ফেসবুকে পোস্ট করে <span className="text-green-600 font-semibold">#selimuddinforsylhet6</span> ব্যবহার করুন
              </div>
              <div className="bg-gray-100 p-3 rounded-xl">
                ৩। অন্তত দুইজন বন্ধুকে মেনশন করুন
              </div>
              <div className="bg-gray-100 p-3 rounded-xl">
                ৪। ১০ জন বিজয়ী নির্বাচন করা হবে
              </div>
              
            </div>
          </div>

        </div>
          <p className=" text-white">© SoftEdge Technology Ltd.</p>
      </div>
      
       <Toaster />
    </div>
  );
};

export default Home;

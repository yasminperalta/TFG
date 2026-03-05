function UploadImage() {
  return (
    <section className="text-center mb-12">
      <h1 className="text-5xl leading-tight mb-4">
        Escanea tu colección de DVDs
      </h1>
      <h2 className="text-lg mb-6">
        Suba un archivo! Lo escanearemos y mostraremos la colección
      </h2>
      <div className="border-[5px] border-white p-2">
        <input type="file" accept="image/*" />
      </div>
      <br />
      <button className="bg-[#E50914] text-white px-5 py-2 cursor-pointer hover:bg-red-700 transition rounded">
        Procesar imagen
      </button>
    </section>
  );
}

export default UploadImage;

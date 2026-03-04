function UploadImage() {
  return (
    <section className="upload-section">
      <h1>Escanea tu colección de DVDs</h1>
      <h2>Suba un archivo! Lo escanearemos y mostraremos la colección</h2>
      <div className="fichero">
        <input type="file" accept="image/*" />
      </div>
      <br />
      <button className="procesar">Procesar imagen</button>
    </section>
  );
}

export default UploadImage;
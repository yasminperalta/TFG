import UploadImage from "../components/UploadImage";
import Collection from "../components/Collection";

function Home() {
  return (
    <div className="container">
      <UploadImage />
      <Collection />
    </div>
  );
}

export default Home;
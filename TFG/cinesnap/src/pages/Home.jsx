import UploadImage from "../components/UploadImage/UploadImage";
import Collection from "../components/Collection/Collections";

function Home() {
  return (
    <div className="container">
      <UploadImage />
      <Collection />
    </div>
  );
}

export default Home;

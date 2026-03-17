import UploadImage from "../components/UploadImage";
import Collection from "../components/Collections";
import Famous from "../components/Famous";

function Home() {
  return (
    <>
      <div className="m-0 font-sans bg-neutral-900 text-white min-h-screen">
        <div className="p-10 mt-12">
          {/* <h1 className="text-5xl leading-tight mb-10">CineSnap</h1> */}
          <UploadImage />
          <Famous />
        </div>
      </div>
    </>
  );
}

export default Home;

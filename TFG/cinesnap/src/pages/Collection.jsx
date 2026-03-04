import DVDCard from "../components/DVDCard";

function Collection() {
  return (
    <section className="collection">
      <h2>Mi colección</h2>
      <div className="grid">
        <DVDCard title="DVD 1" />
        <DVDCard title="DVD 2" />
        <DVDCard title="DVD 3" />
      </div>
    </section>
  );
}

export default Collection;
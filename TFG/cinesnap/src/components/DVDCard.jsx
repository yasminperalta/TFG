function DVDCard({ title }) {
  return (
    <div className="text-center bg-neutral-800 h-[200px] flex justify-center items-center rounded-lg shadow-md">
      DVD
      {title}
    </div>
  );
}

export default DVDCard;

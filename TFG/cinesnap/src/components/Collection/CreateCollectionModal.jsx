import CreateCollectionForm from "./CreateCollectionForm";

function CreateCollectionModal({ onCreate, onClose, existingNames = [] }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-80 space-y-4 shadow-2xl">
        <h3 className="text-xl font-bold text-white">Nueva Lista</h3>
        <CreateCollectionForm onCreate={onCreate} existingNames={existingNames} />
        <button
          onClick={onClose}
          className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default CreateCollectionModal;

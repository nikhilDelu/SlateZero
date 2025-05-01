const DocItem: React.FC<{
  documentId: string;
  title: string;
  onClick: (documentId: string) => void;
}> = ({ documentId, title, onClick }) => {
  return (
    <div
      className="cursor-pointer hover:bg-white/10 rounded-lg"
      onClick={() => onClick(documentId)}
    >
      <h3>{title || `Untitled Document ${documentId}`}</h3>
    </div>
  );
};

export default DocItem;

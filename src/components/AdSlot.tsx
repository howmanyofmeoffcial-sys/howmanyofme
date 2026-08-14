const AdSlot = ({ label = "Advertisement" }: { label?: string }) => (
  <div className="ad-slot">
    <span>{label}</span>
  </div>
);

export default AdSlot;

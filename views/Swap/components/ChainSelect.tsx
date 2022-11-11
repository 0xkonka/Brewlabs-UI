import Card from "./Card";

const ChainSelect = () => {
  return (
    <Card>
      <select id="chain" name="chain" className="w-full border-transparent bg-transparent px-0 py-0">
        <option className="text-gray-500">Ethereum</option>
        <option className="text-gray-500">BNB Smart Chain</option>
      </select>
    </Card>
  );
};

export default ChainSelect;

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Card from "./Card";

const History = () => {
  return (
    <Card>
      <div className="flex justify-between">
        <div>Show History</div>
        <ChevronDownIcon className="h-5 w-5 dark:text-brand" />
      </div>
    </Card>
  );
};

export default History;

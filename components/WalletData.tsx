import Card from "./cards/Card";

const WalletData = () => (
  <div
    role="list"
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  >
    <Card>
      <h3>Your investments</h3>
    </Card>

    <Card>
      <h3>Your investments</h3>
    </Card>

    <Card>
      <h3>Your investments</h3>
    </Card>
  </div>
);

export default WalletData;

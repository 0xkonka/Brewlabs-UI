/**
 * This is a placeholder component for the bond claim button
 * We may need one for token and one for NF
 */
import { Button } from "@components/ui/button";

const BondColClaim = () => {
  const handleClaim = () => {
    window.alert("Claiming bond");
  };

  return (
    <Button onClick={() => handleClaim()} size="sm" variant="outline">
      Claim
    </Button>
  );
};

export default BondColClaim;

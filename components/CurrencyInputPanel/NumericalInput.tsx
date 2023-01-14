const NumericalInput = ({ value }: { value: string | number }) => {
  return <input value={value} placeholder="0.0" className="w-full bg-transparent text-4xl" />;
};

export default NumericalInput;

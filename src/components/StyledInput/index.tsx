import RequireAlert from "@components/RequireAlert";

const StyledInput = ({
  value,
  setValue,
  className,
  placeholder,
  type = "text",
  isRequire = false,
  requireText = "",
}: {
  value: any;
  setValue: any;
  className?: string;
  placeholder?: string;
  type?: string;
  isRequire?: boolean | string;
  requireText?: string;
}) => (
  <div className="relative">
    {type === "text" ? (
      <input
        type={"text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${className} primary-shadow focusShadow h-10 rounded border-none bg-[#B9B8B81A] p-[16px_14px] text-sm text-white outline-none`}
        placeholder={placeholder}
      />
    ) : (
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${className} primary-shadow focusShadow h-10 rounded border-none bg-[#B9B8B81A] p-[16px_14px] text-sm text-white outline-none`}
        placeholder={placeholder}
      />
    )}
    {isRequire ? <RequireAlert text={"Please input field"} value={isRequire} /> : ""}
  </div>
);

export default StyledInput;

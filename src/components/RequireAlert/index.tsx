const RequireAlert = ({ className, value }: { className?: string; value?: string | boolean }) =>
  !value ? <div className={`${className} mt-1 text-xs text-danger`}>*Please input field</div> : <div />;

export default RequireAlert;

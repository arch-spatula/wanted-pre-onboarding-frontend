import { CustomButton, CustomInput } from "../components";
import { useSignup } from "../hooks";

function Signup() {
  const {
    handleSignUp,
    emailRef,
    inputValues,
    handleInputChange,
    validEmail,
    validPassword,
    disabled,
  } = useSignup();

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="pb-2 text-3xl">회원가입</h1>
      <form className="flex flex-col gap-4">
        <CustomInput
          value={inputValues.email}
          placeholder="user@user.com"
          onChange={handleInputChange("email")}
          inputLabel="email"
          errorMessage={validEmail}
          testId="email-input"
          customType="email"
          customRef={emailRef}
        />
        <CustomInput
          value={inputValues.password}
          placeholder="8자리 이상 입력해주십시오."
          onChange={handleInputChange("password")}
          inputLabel="password"
          errorMessage={validPassword}
          testId="password-input"
          customType="password"
        />
        <CustomButton
          text="회원가입"
          hierarchy="primary"
          testId="signup-button"
          disabled={disabled}
          onClick={() => handleSignUp(inputValues.email, inputValues.password)}
        />
      </form>
    </main>
  );
}

export default Signup;

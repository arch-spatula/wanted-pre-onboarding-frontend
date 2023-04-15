import { useRef, useState } from "react";
import { signin } from "../api";
import { CustomButton, CustomInput } from "../components";
import { TODO_PATH } from "../constants/constants";
import { useInput } from "../hooks";
import { checkEmail, checkPassword, isValid, setPath } from "../utils";

function Signin() {
  const { email, password } = JSON.parse(
    sessionStorage.getItem("user") ?? '{ "email": "", "password": "" }'
  );

  const { inputValues, handleInputChange } = useInput<{
    email: string;
    password: string;
  }>({ email, password });

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const handleSignin = async () => {
    const res = await signin(inputValues.email, inputValues.password);
    setEmailErrorMessage("");
    setPasswordErrorMessage("");
    switch (res) {
      case "가입되지 않은 이메일입니다":
        emailRef.current?.focus();
        setEmailErrorMessage(res);
        break;
      case "비밀번호가 일치하지 않습니다.":
        passwordRef.current?.focus();
        setPasswordErrorMessage(res);
        break;
      default:
        localStorage.setItem("token", "Bearer " + res?.access_token);
        setPath(TODO_PATH);
        break;
    }
  };

  const validEmail = checkEmail(inputValues.email);
  const validPassword = checkPassword(inputValues.password);
  const disabled = !isValid(validEmail, validPassword);

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">로그인</h1>
      <div className="flex flex-col gap-4">
        <CustomInput
          value={inputValues.email}
          placeholder="user@user.com"
          onChange={handleInputChange("email")}
          inputLabel={{ label: "아이디", id: "아이디" }}
          errorMessage={validEmail || emailErrorMessage}
          customRef={emailRef}
          testId="email-input"
          type="email"
        />
        <CustomInput
          value={inputValues.password}
          placeholder="8자리 이상 입력해주십시오."
          onChange={handleInputChange("password")}
          inputLabel={{ label: "비밀번호", id: "비밀번호" }}
          errorMessage={validPassword || passwordErrorMessage}
          customRef={passwordRef}
          testId="password-input"
          type="password"
        />
        <CustomButton
          text="로그인"
          hierarchy="primary"
          testId="signin-button"
          disabled={disabled}
          onClick={handleSignin}
        />
      </div>
    </main>
  );
}

export default Signin;

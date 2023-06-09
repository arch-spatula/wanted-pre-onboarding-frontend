import { ReactNode, useRef, useState } from "react";
import { signin } from "../api";
import { CustomButton, CustomInput } from "../components";
import { TODO_ROUTE } from "../constants/constants";
import { useCheckToken, useInput } from "../hooks";
import { checkEmail, checkPassword, isValid, setPath } from "../utils";

/**
 * 없는 이메일과 틀린 비밀번호를 입력했다고 button을 비활성화 하지 않습니다.
 * @todo 1. custom hook으로 로직 이동
 * @todo 2. Throttling leading edge로 서버 부담 줄이기
 */
function Signin() {
  useCheckToken("토큰 보유 시 Todo로");

  const { email, password } = JSON.parse(
    sessionStorage.getItem("user") ?? '{ "email": "", "password": "" }'
  );

  const { inputValues, handleInputChange } = useInput<{
    email: string;
    password: string;
  }>({ email, password });

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [emailErrorMessage, setEmailErrorMessage] = useState<
    string | ReactNode
  >("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const handleSignin = async () => {
    const res = await signin(inputValues.email, inputValues.password);
    setEmailErrorMessage("");
    setPasswordErrorMessage("");
    switch (res) {
      case "가입되지 않은 이메일입니다":
        emailRef.current?.focus();
        setEmailErrorMessage(
          <>
            <a className="underline" href="/signup">
              회원가입
            </a>
            을 먼저 하시기 바랍니다.
          </>
        );
        break;
      case "비밀번호가 일치하지 않습니다.":
        passwordRef.current?.focus();
        setPasswordErrorMessage(res);
        break;
      default:
        localStorage.setItem(
          "token",
          JSON.stringify({
            Authorization: "Bearer " + res?.access_token,
          })
        );
        setPath(TODO_ROUTE);
        sessionStorage.clear();
        break;
    }
  };

  const validEmail = checkEmail(inputValues.email);
  const validPassword = checkPassword(inputValues.password);
  const disabled = !isValid(validEmail, validPassword);

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">로그인</h1>
      <form className="flex flex-col gap-4">
        <CustomInput
          value={inputValues.email}
          placeholder="user@user.com"
          onChange={handleInputChange("email")}
          inputLabel="아이디"
          errorMessage={validEmail || emailErrorMessage}
          customRef={emailRef}
          testId="email-input"
          customType="email"
        />
        <CustomInput
          value={inputValues.password}
          placeholder="8자리 이상 입력해주십시오."
          onChange={handleInputChange("password")}
          inputLabel="비밀번호"
          errorMessage={validPassword || passwordErrorMessage}
          customRef={passwordRef}
          testId="password-input"
          customType="password"
        />
        <CustomButton
          text="로그인"
          hierarchy="primary"
          testId="signin-button"
          disabled={disabled}
          onClick={handleSignin}
        />
      </form>
    </main>
  );
}

export default Signin;

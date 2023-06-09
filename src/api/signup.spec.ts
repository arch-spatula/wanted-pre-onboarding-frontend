import { rest } from "msw";
import { baseURL, SIGNUP_ENDPOINT } from "../constants/constants";
import { server } from "../mocks/server";
import signup from "./signup";

describe("signup", () => {
  it("없던 유저 생성", async () => {
    expect(await signup("@", "12345678")).toBe("");
  });

  it("이미 존재하는 유저", async () => {
    server.use(
      rest.post(baseURL + SIGNUP_ENDPOINT, (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    expect(await signup("@", "12345678")).toBe(
      "동일한 이메일이 이미 존재합니다."
    );
  });
});

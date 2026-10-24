import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { authAsyncThunk } from "../../src/slices/authAsyncThunk";
import GMIApi from "../../src/api/GMIApi";
import { basePath, competitionsPath } from "../../src/paths";
import { Button } from "../commons/Button";
import type { AppDispatch, RootState } from "../../src/store";

export const HeaderUserInfo = () => {
  const userInfo = useSelector((root: RootState) => root.auth.userInfo);
  const dispatch = useDispatch<AppDispatch>();

  const logoutOnClick = () => {
    dispatch(authAsyncThunk.logout());
  };

  const loginOnClick = () => {
    dispatch(authAsyncThunk.login());
  };

  const user = userInfo && userInfo.success ? userInfo.user : undefined;

  if (user) {
    const avatarUrl =
      GMIApi.getInstance().getAvatarUrl(user.discord_info) || `${basePath}/img/profile.png`;
    const displayName = user.user_name || user.discord_info?.username || "Utente";

    return (
      <div className="flex items-center gap-3">
        <Link
          href={`${competitionsPath("/user/")}?user=${user.user_id}`}
          className="flex items-center gap-2 hover:underline decoration-2 underline-offset-4"
        >
          <img
            src={avatarUrl}
            className="w-8 h-8 rounded-full object-cover"
            alt={displayName}
          />
          <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {displayName}
          </span>
        </Link>

        <button
          onClick={logoutOnClick}
          className="text-sm text-gray-500 hover:text-gray-900 hover:underline underline-offset-4 transition-colors"
        >
          Esci
        </button>
      </div>
    );
  }

  return (
    <Button variant="secondary" size="md" onClick={loginOnClick}>
      Login
    </Button>
  );
};

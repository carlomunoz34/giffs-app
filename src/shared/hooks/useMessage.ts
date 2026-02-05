import { useDispatch, useSelector } from "react-redux";
import { selectCurrentMessages, selectLocale, setLocale } from "../../redux/messagesSlice";
import type { Languages } from "../../types/messages.types";

export const useMessage = () => {
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);
  const currentMessages = useSelector(selectCurrentMessages);

  const getMessage = (key: string, params: Record<string, string> = {}) => {
    let message = currentMessages[key] ?? key;

    for (let param of Object.keys(params)) {
      message = message.replaceAll(`${param}`, params[param]);
    }
    return message;
  };

  const changeLocale = (newLocale: Languages) => {
    dispatch(setLocale(newLocale));
  };

  return {
    getMessage,
    locale,
    changeLocale
  };
};
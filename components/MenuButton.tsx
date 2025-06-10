import { TouchableOpacity, Image, ViewStyle } from "react-native";
import clsx from "clsx";

type Props = {
  onPress: () => void;
  top: number; // 외부에서 top 위치 주입
  className?: string; // 추가 스타일 확장 가능
};

export function MenuButton({ onPress, top, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={clsx(
        "absolute left-4 w-[28px] h-[28px]",
        className // 확장 가능성 고려
      )}
      style={{ top }} // 주입된 top 값 사용
    >
      <Image
        source={require("@/assets/images/menu_open.png")}
        resizeMode="contain"
        className="w-full h-full"
        tintColor={"#181A20"}
      />
    </TouchableOpacity>
  );
}

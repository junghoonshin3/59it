import React from "react";
import {
  TouchableOpacity,
  Image,
  GestureResponderEvent,
  ImageSourcePropType,
} from "react-native";
import clsx from "clsx";

type ImageButtonProps = {
  image: ImageSourcePropType;
  onPress: (event: GestureResponderEvent) => void;
  className?: string;
  size?: number; // 버튼 크기
  backgroundColor?: string; // tailwind 색상
  disabled?: boolean;
  accessibilityLabel?: string;
  iconStyle?: string; // 아이콘에만 Tailwind 클래스
};

export const ImageButton = ({
  image,
  onPress,
  className = "",
  size = 40,
  backgroundColor = "bg-white",
  disabled = false,
  accessibilityLabel = "image-button",
  iconStyle = "",
}: ImageButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      className={clsx(
        "justify-center items-center rounded-full",
        backgroundColor,
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        source={image}
        resizeMode="contain"
        className={clsx("w-6 h-6", iconStyle)}
      />
    </TouchableOpacity>
  );
};

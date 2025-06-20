import React, { forwardRef } from "react";
import { StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

type CustomBottomSheetProps = BottomSheetProps & {
  children: React.ReactNode;
};

const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>(
  ({ children, ...props }, ref) => {
    return (
      <BottomSheet
        ref={ref}
        backgroundStyle={styles.backgroundStyle}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        {...props}
      >
        {children}
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: "#181A20",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handleIndicatorStyle: {
    marginTop: 10,
    width: 50,
    height: 5,
    backgroundColor: "#626877",
  },
});

export default CustomBottomSheet;

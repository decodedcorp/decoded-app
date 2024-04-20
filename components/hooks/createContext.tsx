// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

"use client";

import { createContext } from "react";
import { modelInputProps } from "../helpers/Interfaces";
import { StaticImageData } from "next/image";

interface contextProps {
  clicks: [
    clicks: modelInputProps[] | null,
    setClicks: (e: modelInputProps[] | null) => void
  ];
  image: [
    image: React.ReactNode | null,
    setImage: (e: React.ReactNode | null) => void
  ];
  maskImg: [
    maskImg: HTMLImageElement | null,
    setMaskImg: (e: HTMLImageElement | null) => void
  ];
}

const AppContext = createContext<contextProps | null>(null);

export default AppContext;

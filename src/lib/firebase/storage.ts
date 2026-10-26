"use client";
import { ref, getBlob } from "firebase/storage";
import { firebaseClient } from "./client";
export type AssetKind =
  | "salonImages"
  | "serviceImages"
  | "stylistPortraits"
  | "reviewAttachments"
  | "chatAttachments"
  | "purchaseReceipts"
  | "expenseReceipts";
export function assetPath(
  salon: string,
  kind: AssetKind,
  resource: string,
  owner: string,
  file: string,
) {
  const segments = [salon, kind, resource, owner, file];
  if (
    !segments.every(
      (s) => /^[a-zA-Z0-9._-]{1,128}$/.test(s) && s !== "." && s !== "..",
    )
  )
    throw new Error("Invalid asset path");
  return "salons/" + segments.join("/");
}
export function validateAsset(
  file: Pick<File, "type" | "size">,
  receipt = false,
) {
  if (file.size <= 0 || file.size > 5 * 1024 * 1024)
    throw new Error("El archivo debe pesar entre 1 byte y 5 MB");
  if (
    ![
      "image/jpeg",
      "image/png",
      "image/webp",
      ...(receipt ? ["application/pdf"] : []),
    ].includes(file.type)
  )
    throw new Error("Tipo de archivo no permitido");
}
// Authenticated SDK download; do not mint permanent public download-token URLs.
export function readAsset(path: string) {
  return getBlob(ref(firebaseClient().storage, path), 5 * 1024 * 1024);
}

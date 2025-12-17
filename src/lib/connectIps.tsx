import { toast } from "sonner";

export const redirectToConnectIPS = (txn: Record<string, any>) => {
  if (!txn || !txn.token) {
    console.error("Invalid transaction data:", txn);
    return;
  }

  const mappedTxn = {
    MERCHANTID: txn.merchant_id,
    APPID: txn.app_id,
    APPNAME: txn.app_name,
    TXNID: txn.transaction_id,
    TXNDATE: txn.transaction_date,
    TXNCRNCY: txn.currency,
    TXNAMT: txn.price,
    REFERENCEID: txn.ref_id,
    REMARKS: txn.remarks,
    PARTICULARS: txn.particular,
    TOKEN: txn.token,
  };

  Object.entries(mappedTxn).forEach(([k, v]) => {
    if (!v) toast.error(`Missing value for ${k}`);
  });

  // Build form
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://login.connectips.com/connectipswebgw/loginpage";
  form.target = "_blank"; 
  form.style.display = "none";

  const merchantId = document.createElement("input");
  merchantId.type = "hidden";
  merchantId.name = "MERCHANTID";
  merchantId.value = String(mappedTxn.MERCHANTID);
  form.appendChild(merchantId);

  const appId = document.createElement("input");
  appId.type = "hidden";
  appId.name = "APPID";
  appId.value = String(mappedTxn.APPID);
  form.appendChild(appId);

  const appName = document.createElement("input");
  appName.type = "hidden";
  appName.name = "APPNAME";
  appName.value = String(mappedTxn.APPNAME);
  form.appendChild(appName);

  const txnId = document.createElement("input");
  txnId.type = "hidden";
  txnId.name = "TXNID";
  txnId.value = String(mappedTxn.TXNID);
  form.appendChild(txnId);

  const txnDate = document.createElement("input");
  txnDate.type = "hidden";
  txnDate.name = "TXNDATE";
  txnDate.value = String(mappedTxn.TXNDATE);
  form.appendChild(txnDate);

  const txnCrncy = document.createElement("input");
  txnCrncy.type = "hidden";
  txnCrncy.name = "TXNCRNCY";
  txnCrncy.value = String(mappedTxn.TXNCRNCY);
  form.appendChild(txnCrncy);

  const txnAmt = document.createElement("input");
  txnAmt.type = "hidden";
  txnAmt.name = "TXNAMT";
  txnAmt.value = String(mappedTxn.TXNAMT);
  form.appendChild(txnAmt);

  const refId = document.createElement("input");
  refId.type = "hidden";
  refId.name = "REFERENCEID";
  refId.value = String(mappedTxn.REFERENCEID);
  form.appendChild(refId);

  const remarks = document.createElement("input");
  remarks.type = "hidden";
  remarks.name = "REMARKS";
  remarks.value = String(mappedTxn.REMARKS);
  form.appendChild(remarks);

  const particulars = document.createElement("input");
  particulars.type = "hidden";
  particulars.name = "PARTICULARS";
  particulars.value = String(mappedTxn.PARTICULARS);
  form.appendChild(particulars);

  const token = document.createElement("input");
  token.type = "hidden";
  token.name = "TOKEN";
  token.value = String(mappedTxn.TOKEN);
  form.appendChild(token);

  console.log("Submitting ConnectIPS form with:", mappedTxn);

  // Submit form
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

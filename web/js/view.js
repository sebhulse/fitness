async function pageLoad() {
  const params = new URLSearchParams(window.location.search);

  console.log("hi this is in the load function");

  const type = params.get("type");
  const area = params.get("area");
  const level = params.get("level");
  const duration = params.get("duration");
  console.log(type);

  await handleRequest(duration, type, area, level)

}
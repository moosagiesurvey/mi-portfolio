import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import 'piccolore';
import 'html-escaper';
import 'clsx';
import { N as NOOP_MIDDLEWARE_HEADER, d as decodeKey } from './chunks/astro/server_DP7zI2z4.mjs';
import 'es-module-lexer';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/asadm/OneDrive%20-%20Educor%20Holdings/Desktop/Projects/portfolio/","cacheDir":"file:///C:/Users/asadm/OneDrive%20-%20Educor%20Holdings/Desktop/Projects/portfolio/node_modules/.astro/","outDir":"file:///C:/Users/asadm/OneDrive%20-%20Educor%20Holdings/Desktop/Projects/portfolio/dist/","srcDir":"file:///C:/Users/asadm/OneDrive%20-%20Educor%20Holdings/Desktop/Projects/portfolio/src/","publicDir":"file:///C:/Users/asadm/OneDrive%20-%20Educor%20Holdings/Desktop/Projects/portfolio/public/","buildClientDir":"file:///C:/Users/asadm/OneDrive%20-%20Educor%20Holdings/Desktop/Projects/portfolio/dist/","buildServerDir":"file:///C:/Users/asadm/OneDrive%20-%20Educor%20Holdings/Desktop/Projects/portfolio/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index._-7ofd5H.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BDvXTVEd.mjs","C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_DM36vZAS.mjs","C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.DJjjeR-p.js","C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/components/Navbar.astro?astro&type=script&index=0&lang.ts":"_astro/Navbar.astro_astro_type_script_index_0_lang.CG3WiDQx.js","C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/components/Hero.astro?astro&type=script&index=0&lang.ts":"_astro/Hero.astro_astro_type_script_index_0_lang.zsrbzZVj.js","C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/components/Skills.astro?astro&type=script&index=0&lang.ts":"_astro/Skills.astro_astro_type_script_index_0_lang.BvERkvU0.js","C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/components/ProjectCard.astro?astro&type=script&index=0&lang.ts":"_astro/ProjectCard.astro_astro_type_script_index_0_lang.Cz_9rH3C.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/components/Navbar.astro?astro&type=script&index=0&lang.ts","const e=document.querySelector(\".navbar\");window.addEventListener(\"scroll\",()=>{window.scrollY>50?(e.classList.add(\"glass\",\"shadow-lg\",\"shadow-nexus-cyan/5\"),e.style.padding=\"10px 24px\"):(e.classList.remove(\"glass\",\"shadow-lg\",\"shadow-nexus-cyan/5\"),e.style.padding=\"16px 24px\")});document.querySelectorAll('.navbar a[href^=\"#\"]').forEach(t=>{t.addEventListener(\"click\",function(r){r.preventDefault();const s=document.querySelector(this.getAttribute(\"href\"));s&&s.scrollIntoView({behavior:\"smooth\",block:\"start\"})})});"],["C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/components/Hero.astro?astro&type=script&index=0&lang.ts","(function(){const n=document.getElementById(\"particle-canvas\"),s=n.getContext(\"2d\");let e=[],c=0,a=0;function d(){n.width=window.innerWidth,n.height=window.innerHeight}d(),window.addEventListener(\"resize\",d);class x{constructor(){this.reset()}reset(){this.x=Math.random()*n.width,this.y=Math.random()*n.height,this.size=Math.random()*2+.5,this.speedX=(Math.random()-.5)*.5,this.speedY=(Math.random()-.5)*.5,this.opacity=Math.random()*.5+.1,this.color=Math.random()>.5?\"0, 240, 255\":\"123, 47, 247\"}update(){this.x+=this.speedX,this.y+=this.speedY;const i=c-this.x,o=a-this.y;Math.sqrt(i*i+o*o)<150&&(this.x-=i*.01,this.y-=o*.01),(this.x<0||this.x>n.width)&&(this.speedX*=-1),(this.y<0||this.y>n.height)&&(this.speedY*=-1)}draw(){s.beginPath(),s.arc(this.x,this.y,this.size,0,Math.PI*2),s.fillStyle=`rgba(${this.color}, ${this.opacity})`,s.fill()}}for(let t=0;t<120;t++)e.push(new x);function p(){for(let t=0;t<e.length;t++)for(let i=t+1;i<e.length;i++){const o=e[t].x-e[i].x,r=e[t].y-e[i].y,g=Math.sqrt(o*o+r*r);g<150&&(s.beginPath(),s.moveTo(e[t].x,e[t].y),s.lineTo(e[i].x,e[i].y),s.strokeStyle=`rgba(0, 240, 255, ${.06*(1-g/150)})`,s.lineWidth=.5,s.stroke())}}function l(){s.clearRect(0,0,n.width,n.height),e.forEach(t=>{t.update(),t.draw()}),p(),requestAnimationFrame(l)}l(),document.addEventListener(\"mousemove\",t=>{c=t.clientX,a=t.clientY});const m=\"Building the future, one pixel at a time. Explore my universe of projects crafted with cutting-edge technology.\",u=document.getElementById(\"typewriter\");let h=0;function y(){h<m.length&&(u.textContent+=m.charAt(h),h++,setTimeout(y,25))}const f=new IntersectionObserver(t=>{t.forEach(i=>{i.isIntersecting&&(setTimeout(y,1e3),f.disconnect())})});f.observe(u)})();"],["C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/components/Skills.astro?astro&type=script&index=0&lang.ts","const s=document.querySelectorAll(\"#skills .h-1\\\\.5 > div\"),r=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting&&(setTimeout(()=>{e.target.style.width=e.target.parentElement.previousElementSibling?.querySelector(\"span\")?.textContent||\"0%\"},300),r.unobserve(e.target))})},{threshold:.3});s.forEach(t=>r.observe(t));"],["C:/Users/asadm/OneDrive - Educor Holdings/Desktop/Projects/portfolio/src/components/ProjectCard.astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(\".project-card\").forEach(e=>{e.addEventListener(\"mousemove\",t=>{const o=e.getBoundingClientRect();e.style.setProperty(\"--mouse-x\",t.clientX-o.left+\"px\"),e.style.setProperty(\"--mouse-y\",t.clientY-o.top+\"px\")})});"]],"assets":["/_astro/index._-7ofd5H.css","/favicon.svg","/_astro/BaseLayout.astro_astro_type_script_index_0_lang.DJjjeR-p.js","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"k0H2NgDLqwAaU9u9OY6tUdcRURqjpvubNB3JcYwKTRg=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_DM36vZAS.mjs');

export { manifest };

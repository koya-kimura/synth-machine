float gray (vec3 col){
    return dot(col, vec3(0.299, 0.587, 0.114));
}

vec3 hsv2rgb(in float h){
    float s = 1.;
    float v = 1.;

    vec4 K = vec4(1., 2. / 3., 1. / 3., 3.);
    vec3 p = abs(fract(vec3(h) + K.xyz) * 6. - K.w);
    vec3 rgb = v * mix(vec3(K.x), clamp(p - K.x, 0., 1.), s);

    return rgb;
}

// 色ベクトルをポスタライズする
vec3 posterizeColor(vec3 col, float levels) {
    return floor(col * levels) / levels;
}

// 各色チャンネルに閾値を適用する
vec3 thresholdColor(vec3 col, float thresh) {
    return vec3(
        col.r > thresh ? 1.0 : 0.0,
        col.g > thresh ? 1.0 : 0.0,
        col.b > thresh ? 1.0 : 0.0
    );
}

// 色を反転する
vec3 invert(vec3 col) {
    return 1.0 - col;
}

// RGBをHSVに変換する
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// RGBシフト
vec3 rgbShift(sampler2D tex, vec2 uv, vec2 shift){
    vec3 col = texture2D(tex, uv).rgb;
    vec3 shiftedCol1 = texture2D(tex, uv + shift).rgb;
    vec3 shiftedCol2 = texture2D(tex, uv - shift).rgb;

    return vec3(col.r, max(shiftedCol1.g, shiftedCol2.g), col.b);
}

// Sobelエッジ検出
float edge(sampler2D tex, vec2 uv, vec2 resolution) {
    vec2 texel = 1.0 / resolution;
    
    // 周囲8ピクセルのグレースケール値を取得
    float tl = gray(texture2D(tex, uv + vec2(-texel.x, -texel.y)).rgb);
    float t  = gray(texture2D(tex, uv + vec2(0.0, -texel.y)).rgb);
    float tr = gray(texture2D(tex, uv + vec2(texel.x, -texel.y)).rgb);
    float l  = gray(texture2D(tex, uv + vec2(-texel.x, 0.0)).rgb);
    float r  = gray(texture2D(tex, uv + vec2(texel.x, 0.0)).rgb);
    float bl = gray(texture2D(tex, uv + vec2(-texel.x, texel.y)).rgb);
    float b  = gray(texture2D(tex, uv + vec2(0.0, texel.y)).rgb);
    float br = gray(texture2D(tex, uv + vec2(texel.x, texel.y)).rgb);
    
    // Sobelカーネル
    float gx = -tl - 2.0*l - bl + tr + 2.0*r + br;
    float gy = -tl - 2.0*t - tr + bl + 2.0*b + br;
    
    return sqrt(gx*gx + gy*gy);
}

// Sobelエッジ検出（カラー出力）
vec3 edgeColor(sampler2D tex, vec2 uv, vec2 resolution) {
    float e = edge(tex, uv, resolution);
    return vec3(e);
}
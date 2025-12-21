vec2 mosaic(vec2 uv, float n, vec2 res){
    return vec2((floor(uv.x * n) + 0.5) / n, (floor(uv.y * n * res.y / res.x) + 0.5) / (n*res.y/res.x));
}

// UV座標をタイリングする
vec2 tileUV(vec2 uv, float scale) {
    return fract(uv * scale);
}

// UV座標をスケーリングする
vec2 scaleUV(vec2 uv, float scale) {
    return uv * scale;
}

// UV座標を中心を中心に回転する
vec2 rotateUV(vec2 uv, float angle) {
    vec2 center = vec2(0.5, 0.5);
    uv -= center;
    uv = vec2(uv.x * cos(angle) - uv.y * sin(angle), uv.x * sin(angle) + uv.y * cos(angle));
    uv += center;
    return uv;
}

// UV座標をミラー反転する
vec2 mirror(vec2 uv) {
    return vec2(1.0 - uv.x, uv.y);
}

vec2 distortion(vec2 uv, float amount) {
    uv = rotateUV(uv, length(uv - vec2(0.5)) * PI * amount);
    return uv;
}

// ドットパターン（ハーフトーン風）
// sampler: テクスチャ
// uv: UV座標
// resolution: 解像度
// dotCount: ドットの数（横方向）
// 戻り値: ドットの色（円の外は黒）
vec3 dotPattern(sampler2D sampler, vec2 uv, vec2 resolution, float dotCount) {
    // アスペクト比を考慮したグリッドサイズ
    float aspect = resolution.x / resolution.y;
    vec2 gridSize = vec2(dotCount, dotCount / aspect);
    
    // グリッドの各セルの中心座標を計算
    vec2 cellUV = fract(uv * gridSize);
    vec2 cellCenter = (floor(uv * gridSize) + 0.5) / gridSize;
    
    // セル中心の色をサンプリング
    vec3 col = texture2D(sampler, cellCenter).rgb;
    
    // セル内での中心からの距離
    vec2 cellDist = cellUV - 0.5;
    float dist = length(cellDist);
    
    // 明るさに応じたドットサイズ（明るいほど大きい）
    float brightness = dot(col, vec3(0.299, 0.587, 0.114));
    float radius = 0.5 * brightness;
    
    // 円の内側なら色を返す、外側は黒
    if (dist < radius) {
        return col;
    } else {
        return vec3(0.0);
    }
}

// ドットパターン（固定半径版）
// dotCount: ドットの数（横方向）
// dotRadius: ドットの半径（0.0-0.5、セルサイズに対する割合）
vec3 dotPatternFixed(sampler2D sampler, vec2 uv, vec2 resolution, float dotCount, float dotRadius) {
    float aspect = resolution.x / resolution.y;
    vec2 gridSize = vec2(dotCount, dotCount / aspect);
    
    vec2 cellUV = fract(uv * gridSize);
    vec2 cellCenter = (floor(uv * gridSize) + 0.5) / gridSize;
    
    vec3 col = texture2D(sampler, cellCenter).rgb;
    
    vec2 cellDist = cellUV - 0.5;
    float dist = length(cellDist);
    
    if (dist < dotRadius) {
        return col;
    } else {
        return vec3(0.0);
    }
}
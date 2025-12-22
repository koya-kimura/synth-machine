float PI = 3.14159265358979;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

mat2 rot(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float atan2(float y, float x){
    return x == 0. ? sign(y) * PI / 2. : atan(y, x);
}

vec2 xy2pol(vec2 xy){
    return vec2(atan2(xy.y, xy.x), length(xy));
}

vec2 pol2xy(vec2 pol){
    return pol.y * vec2(cos(pol.x), sin(pol.x));
}

// 値をスケーリングする
float scale(float value, float factor) {
    return value * factor;
}

// タイリングパターンを作成する
float tile(float value, float period) {
    return mod(value, period);
}

// 色のレベル数を減らす（ポスタライズ）
float posterize(float value, float levels) {
    return floor(value * levels) / levels;
}

// 閾値を適用する（2値化）
float threshold(float value, float thresh) {
    return value > thresh ? 1.0 : 0.0;
}

float map(float value, float a, float b, float c, float d) {
    return (value - a) * (d - c) / (b - a) + c;
}

// UniformRandom互換のハッシュ関数（seed付き）
float uniformRandom(float seed1, float seed2, float count) {
    return fract(sin(dot(vec3(seed1, seed2, count), vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

/**
 * leapNoise - シームレスにループする補間ノイズ
 * 指定した拍数(loop)ごとに次のランダム値に遷移する
 * 
 * @param x 現在の時間（拍数など）
 * @param loop ループの周期（何拍で次の値に移るか）
 * @param move 遷移にかける時間（拍数）
 * @param seed1 乱数シード1
 * @param seed2 乱数シード2
 * @return 0.0〜1.0の補間されたノイズ値
 */
float leapNoise(float x, float loop, float move, float seed1, float seed2) {
    float count = floor(x / loop);
    float t = clamp(((mod(x, loop)) - (loop - move)) / move, 0.0, 1.0);
    
    float x1 = uniformRandom(seed1, seed2, count);
    float x2 = uniformRandom(seed1, seed2, count + 1.0);
    
    return mix(x1, x2, t);
}

// leapNoiseの簡易版（シード省略）
// float leapNoise(float x, float loop, float move) {
//     return leapNoise(x, loop, move, 0.0, 0.0);
// }

/**
 * leapRamp - 補間係数を計算
 * ループ周期内の現在位置に基づいて次の値への遷移進行度を算出
 * 
 * @param x 現在の時間
 * @param loop ループの周期
 * @param move 遷移にかける時間
 * @return count + 補間係数（整数部がカウント、小数部が遷移進行度）
 */
float leapRamp(float x, float loop, float move) {
    float count = floor(x / loop);
    return count + clamp((mod(x, loop) - (loop - move)) / move, 0.0, 1.0);
}
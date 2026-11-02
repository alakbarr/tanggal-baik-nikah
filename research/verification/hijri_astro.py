"""Independent astronomical check of month starts (JPL DE421 via skyfield).

MABIMS/Kemenag model: criteria met at ANY point in Indonesia at its own sunset
(topocentric altitude >= 3 deg and topocentric elongation >= 6.4 deg) on the evening of the 29th
=> month starts next day, else the day after (istikmal).
KHGT model: geocentric altitude >= 5 and geocentric elongation >= 8 at any place whose sunset falls
before 24:00 UTC of that UTC date => month starts the next day; second clause approximated.
Prediction only. Official dates also depend on rukyat results (Kemenag) and isbat decisions.
"""
import io, sys, datetime as dt, math
import numpy as np
from skyfield import almanac
from skyfield.api import load, wgs84, utc
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ts = load.timescale()
eph = load("de421.bsp")
earth, sun, moon = eph["earth"], eph["sun"], eph["moon"]

def new_moons(t0, t1):
    t, y = almanac.find_discrete(ts.utc(*t0), ts.utc(*t1), almanac.moon_phases(eph))
    return [ti for ti, yi in zip(t, y) if yi == 0]

def sunset_utc(lat, lon, day):
    """UTC time of sunset (alt -0.8333) whose UTC date is `day` (datetime.date); None if none."""
    loc = wgs84.latlon(lat, lon)
    t0 = ts.utc(day.year, day.month, day.day, 0, np.arange(0, 1441, 2))
    alt = (earth + loc).at(t0).observe(sun).apparent().altaz()[0].degrees
    for i in range(len(alt) - 1):
        if alt[i] > -0.8333 >= alt[i + 1]:
            f = (alt[i] + 0.8333) / (alt[i] - alt[i + 1])
            minutes = (i + f) * 2
            return ts.utc(day.year, day.month, day.day, 0, minutes)
    return None

def moon_geometry(lat, lon, t):
    loc = wgs84.latlon(lat, lon)
    topo = (earth + loc).at(t)
    m_top = topo.observe(moon).apparent()
    alt_top = m_top.altaz()[0].degrees
    s_top = topo.observe(sun).apparent()
    elong_top = m_top.separation_from(s_top).degrees
    geo = earth.at(t)
    m_geo = geo.observe(moon).apparent()
    s_geo = geo.observe(sun).apparent()
    elong_geo = m_geo.separation_from(s_geo).degrees
    obs = np.array(loc.at(t).position.au)
    mv = np.array(m_geo.position.au)
    ang = math.degrees(math.acos(np.dot(obs, mv) / (np.linalg.norm(obs) * np.linalg.norm(mv))))
    alt_geo = 90 - ang
    return alt_top, elong_top, alt_geo, elong_geo

INDO = [(la, lo) for la in range(-10, 7, 2) for lo in range(95, 142, 4)]
def mabims_met(day, tconj):
    best = None
    for la, lo in INDO:
        ts_ = sunset_utc(la, lo, day)
        if ts_ is None: continue
        if ts_.tt < tconj.tt:  # conjunction after sunset here
            continue
        at, et, _, _ = moon_geometry(la, lo, ts_)
        if at >= 3 and et >= 6.4:
            return True, (la, lo, round(at, 2), round(et, 2))
        if best is None or at > best[2]:
            best = (la, lo, round(at, 2), round(et, 2))
    return False, best

GRID = [(la, lo) for la in range(-60, 61, 15) for lo in range(-180, 180, 10)]
def khgt_met(day, tconj):
    """criteria at some sunset on UTC date `day` (clause 1)."""
    for la, lo in GRID:
        s = sunset_utc(la, lo, day)
        if s is None or s.tt < tconj.tt: continue
        _, _, ag, eg = moon_geometry(la, lo, s)
        if ag >= 5 and eg >= 8:
            return True, (la, lo, round(ag, 2), round(eg, 2))
    return False, None

def khgt_clause2(day, tconj):
    """sunsets after 24:00 UTC of `day` (UTC date day+1 early), Americas, conj before ~17:00 UTC of day."""
    nxt = day + dt.timedelta(days=1)
    conj_dt = tconj.utc_datetime()
    if conj_dt.date() != day or conj_dt.hour >= 17: return False
    for la in range(-50, 66, 10):
        for lo in range(-165, -35, 10):
            s = sunset_utc(la, lo, nxt)
            if s is None: continue
            _, _, ag, eg = moon_geometry(la, lo, s)
            if ag >= 5 and eg >= 8: return True
    return False

def predict(tconj):
    cj = tconj.utc_datetime()
    wib = cj + dt.timedelta(hours=7)
    d0 = wib.date()
    ok, info = mabims_met(d0, tconj)
    start_k = d0 + dt.timedelta(days=1 if ok else 2)
    # KHGT: evening evaluated on UTC date of conjunction (sunsets that day) and, if not met, next UTC date
    uday = cj.date()
    met, kinfo = khgt_met(uday, tconj)
    if not met and khgt_clause2(uday, tconj):
        met = True
    if met:
        start_g = uday + dt.timedelta(days=1)
    else:
        met2, _ = khgt_met(uday + dt.timedelta(days=1), tconj)
        start_g = uday + dt.timedelta(days=2) if met2 or True else None
    return cj, d0, ok, info, start_k, start_g

if __name__ == "__main__":
    for t in new_moons((2025, 6, 1), (2027, 7, 15)):
        cj, d0, ok, info, sk, sg = predict(t)
        print(cj.strftime("%Y-%m-%d %H:%M UTC"), "| MABIMS met on", d0, ok, info, "-> Kemenag-model start", sk, sk.strftime("%a"), "| KHGT-model start", sg, sg.strftime("%a"))

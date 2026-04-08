export const MATERIALS = {
  STEEL:    { id: 'steel',  name: 'Çelik (Steel)',            vL: 5920, vT: 3240, tcL: -0.8, tcT: -0.5, atten: 0.005 },
  ALUMINUM: { id: 'alu',   name: 'Alüminyum (Aluminum)',      vL: 6320, vT: 3130, tcL: -1.2, tcT: -0.7, atten: 0.015 },
  COPPER:   { id: 'copper',name: 'Bakır (Copper)',            vL: 4700, vT: 2260, tcL: -1.0, tcT: -0.6, atten: 0.03  },
};

export const PROBES = {
  STRAIGHT_DUAL: { id: 'straight', name: 'Çift Kristal Düz (0°)', angle: 0,  type: 'L', color: '#3b82f6' },
  ANGLE_45:      { id: 'a45',      name: 'Açılı 45°',              angle: 45, type: 'T', color: '#22c55e' },
  ANGLE_60:      { id: 'a60',      name: 'Açılı 60°',              angle: 60, type: 'T', color: '#eab308' },
  ANGLE_70:      { id: 'a70',      name: 'Açılı 70°',              angle: 70, type: 'T', color: '#ef4444' },
};

export const BLOCKS = {
  K1:   { id: 'k1',   name: 'K1 (V1) Kalibrasyon Bloğu', thickness: 25   },
  K2:   { id: 'k2',   name: 'K2 (V2) Kalibrasyon Bloğu', thickness: 12.5 },
  FLAW: { id: 'flaw', name: 'Hata Tespit Bloğu',          thickness: 30   },
};

export function calculateEchoes(state) {
  const {
    probe, probeDir = 1, material, materialVelocity, block,
    probePos, probeIndex = 0, flaws, velocity, delay, gain,
    range, temperature = 20, surfaceLoss = 0
  } = state;

  const tempDiff = temperature - 20;
  const baseVelocity = materialVelocity || (probe.type === 'L' ? material.vL : material.vT);
  const v_true = baseVelocity + tempDiff * (probe.type === 'L' ? material.tcL : material.tcT);

  const echoes = [];
  const effectiveProbePos = probe.angle > 0 ? probePos + probeDir * probeIndex : probePos;

  const applyAttenuation = (baseAmp, pathLength) => {
    const lossDb = (material.atten * pathLength) + surfaceLoss;
    return baseAmp * Math.pow(10, -lossDb / 20);
  };

  // Initial Pulse
  echoes.push({ time: 0, amp: 100, width: 2 });

  if (block.id === 'k1') {
    if (probe.angle > 0) {
      const distToCenter = Math.abs(effectiveProbePos - 100);
      if (distToCenter < 30 && probeDir === 1) {
        const path = 100 * 2;
        const time = path / (v_true / 1000);
        const amp = applyAttenuation(100 * Math.exp(-Math.pow(distToCenter / 10, 2)), path);
        echoes.push({ time, amp, width: 3 });
      }
    } else {
      for (let i = 1; i <= 10; i++) {
        const path = 25 * i * 2;
        const time = path / (v_true / 1000);
        const amp = applyAttenuation(100 * Math.pow(0.8, i), path);
        echoes.push({ time, amp, width: 2 });
      }
    }
  } else if (block.id === 'k2') {
    if (probe.angle > 0) {
      const distToCenter = Math.abs(effectiveProbePos - 25);
      if (distToCenter < 20) {
        if (probeDir === 1) {
          const path25 = 25 * 2;
          const time25 = path25 / (v_true / 1000);
          const amp25 = applyAttenuation(100 * Math.exp(-Math.pow(distToCenter / 8, 2)), path25);
          echoes.push({ time: time25, amp: amp25, width: 2 });
          const path100 = 100 * 2;
          const time100 = path100 / (v_true / 1000);
          const amp100 = applyAttenuation(100 * Math.exp(-Math.pow(distToCenter / 8, 2)) * 0.6, path100);
          echoes.push({ time: time100, amp: amp100, width: 3 });
        } else {
          const path50 = 50 * 2;
          const time50 = path50 / (v_true / 1000);
          const amp50 = applyAttenuation(100 * Math.exp(-Math.pow(distToCenter / 8, 2)), path50);
          echoes.push({ time: time50, amp: amp50, width: 2 });
        }
      }
    } else {
      for (let i = 1; i <= 10; i++) {
        const path = 12.5 * i * 2;
        const time = path / (v_true / 1000);
        const amp = applyAttenuation(100 * Math.pow(0.8, i), path);
        echoes.push({ time, amp, width: 2 });
      }
    }
  } else if (block.id === 'flaw') {
    const T = block.thickness;
    if (probe.angle === 0) {
      let backwallShadow = 1;
      flaws.forEach((f) => {
        const dx = Math.abs(effectiveProbePos - f.x);
        if (dx < f.size + 6) {
          const shadow = Math.max(0, 1 - (f.size / 2.5) * Math.exp(-Math.pow(dx / 4, 2)));
          backwallShadow *= shadow;
        }
      });
      for (let i = 1; i <= 5; i++) {
        const path = T * i * 2;
        const time = path / (v_true / 1000);
        const amp = applyAttenuation(100 * Math.pow(0.8, i) * backwallShadow, path);
        if (amp > 0.5) echoes.push({ time, amp, width: 2 });
      }
      flaws.forEach((f) => {
        const dx = Math.abs(effectiveProbePos - f.x);
        if (dx < f.size + 8) {
          const path = f.y * 2;
          const time = path / (v_true / 1000);
          const baseAmp = 80 * (f.size / 3) * Math.exp(-Math.pow(dx / 4, 2));
          const amp = applyAttenuation(baseAmp, path);
          echoes.push({ time, amp, width: 2, sourceId: f.id });
        }
      });
    } else {
      const theta = (probe.angle * Math.PI) / 180;
      let currentX = effectiveProbePos;
      let currentPath = 0;
      for (let leg = 1; leg <= 3; leg++) {
        const startY = leg % 2 !== 0 ? 0 : T;
        flaws.forEach((f) => {
          const dy = Math.abs(f.y - startY);
          const expectedX = currentX + probeDir * dy * Math.tan(theta);
          const dx = Math.abs(f.x - expectedX) * Math.cos(theta);
          if (dx < f.size + 10) {
            const pathHit = currentPath + dy / Math.cos(theta);
            const totalPath = pathHit * 2;
            const time = totalPath / (v_true / 1000);
            const baseAmp = 90 * (f.size / 3) * Math.exp(-Math.pow(dx / 5, 2)) * Math.pow(0.7, leg - 1);
            const amp = applyAttenuation(baseAmp, totalPath);
            echoes.push({ time, amp, width: 3, sourceId: f.id });
          }
        });
        currentX += probeDir * T * Math.tan(theta);
        currentPath += T / Math.cos(theta);
      }
    }
  }

  return echoes.map(e => {
    const t_delayed = e.time - delay;
    const displayDist = (t_delayed * velocity / 1000) / 2;
    const displayAmp = e.amp * Math.pow(10, (gain - 40) / 20);
    return {
      distance: displayDist,
      amplitude: Math.min(100, Math.max(0, displayAmp)),
      width: e.width * (velocity / 5000),
      sourceId: e.sourceId,
    };
  }).filter(e => e.distance >= 0 && e.distance <= range && e.amplitude > 0.5);
}

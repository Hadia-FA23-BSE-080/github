import { haversineDistance, estimateTravelMinutes } from "./utils";

export interface EngineerLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isAvailable: boolean;
  rating: number;
  skills: string[];
}

export interface DispatchResult {
  engineerId: string;
  engineerName: string;
  distanceKm: number;
  estimatedMinutes: number;
  score: number;
  reason: string;
}

/**
 * AI-powered dispatch: selects the nearest available engineer
 * weighted by distance, rating, and skill match.
 */
export function dispatchToNearestEngineer(
  jobLat: number,
  jobLng: number,
  jobTradeType: string,
  engineers: EngineerLocation[]
): DispatchResult | null {
  const available = engineers.filter((e) => e.isAvailable);
  if (available.length === 0) return null;

  const scored = available.map((engineer) => {
    const distanceKm = haversineDistance(jobLat, jobLng, engineer.lat, engineer.lng);
    const travelMinutes = estimateTravelMinutes(distanceKm);

    const hasSkillMatch = engineer.skills.some(
      (s) => s.toUpperCase() === jobTradeType.toUpperCase()
    );

    // Lower score is better (distance-weighted)
    const distanceScore = distanceKm * 10;
    const ratingBonus = (5 - engineer.rating) * 2;
    const skillPenalty = hasSkillMatch ? 0 : 15;
    const score = distanceScore + ratingBonus + skillPenalty;

    return {
      engineerId: engineer.id,
      engineerName: engineer.name,
      distanceKm: Math.round(distanceKm * 10) / 10,
      estimatedMinutes: travelMinutes,
      score,
      hasSkillMatch,
    };
  });

  scored.sort((a, b) => a.score - b.score);
  const best = scored[0];

  const reason = buildDispatchReason(best);

  return {
    engineerId: best.engineerId,
    engineerName: best.engineerName,
    distanceKm: best.distanceKm,
    estimatedMinutes: best.estimatedMinutes,
    score: Math.round(best.score * 10) / 10,
    reason,
  };
}

function buildDispatchReason(engineer: {
  engineerName: string;
  distanceKm: number;
  estimatedMinutes: number;
  hasSkillMatch: boolean;
}): string {
  const parts = [
    `${engineer.engineerName} is ${engineer.distanceKm} km away`,
    `ETA ~${engineer.estimatedMinutes} min`,
  ];
  if (engineer.hasSkillMatch) {
    parts.push("skill match confirmed");
  }
  return parts.join(" · ");
}

/** Simulate engineer movement toward job destination */
export function interpolatePosition(
  engineerLat: number,
  engineerLng: number,
  jobLat: number,
  jobLng: number,
  progress: number
): { lat: number; lng: number; heading: number } {
  const t = Math.min(1, Math.max(0, progress));
  const lat = engineerLat + (jobLat - engineerLat) * t;
  const lng = engineerLng + (jobLng - engineerLng) * t;

  const dLng = jobLng - engineerLng;
  const dLat = jobLat - engineerLat;
  const heading = ((Math.atan2(dLng, dLat) * 180) / Math.PI + 360) % 360;

  return { lat, lng, heading };
}

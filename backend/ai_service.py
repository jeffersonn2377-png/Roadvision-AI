import random
import json
import os
from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseDetector(ABC):
    @abstractmethod
    def detect(self, file_path: str, file_type: str = "image", sample_preset: str = None) -> Dict[str, Any]:
        pass


class DemoDetector(BaseDetector):
    """
    Simulated AI detection engine for demonstration & prototype purposes.
    Generates realistic detection bounding boxes, damage types, confidence scores, and visual area metrics.
    """

    DAMAGE_TYPES = [
        "Pothole",
        "Crack",
        "Surface Deterioration",
        "Broken Road Edge",
        "Damaged Road Marking"
    ]

    PRESET_PROFILES = {
        "pothole": {
            "damage_type": "Pothole",
            "confidence": 0.94,
            "damage_area": 2.4,
            "visual_severity": 88.0,
            "bounding_box": {"x": 25, "y": 30, "w": 45, "h": 35}
        },
        "crack": {
            "damage_type": "Crack",
            "confidence": 0.89,
            "damage_area": 1.8,
            "visual_severity": 62.0,
            "bounding_box": {"x": 15, "y": 40, "w": 60, "h": 20}
        },
        "edge": {
            "damage_type": "Broken Road Edge",
            "confidence": 0.91,
            "damage_area": 3.1,
            "visual_severity": 79.0,
            "bounding_box": {"x": 65, "y": 20, "w": 30, "h": 70}
        },
        "surface": {
            "damage_type": "Surface Deterioration",
            "confidence": 0.86,
            "damage_area": 4.2,
            "visual_severity": 54.0,
            "bounding_box": {"x": 20, "y": 25, "w": 55, "h": 50}
        },
        "marking": {
            "damage_type": "Damaged Road Marking",
            "confidence": 0.88,
            "damage_area": 1.2,
            "visual_severity": 41.0,
            "bounding_box": {"x": 35, "y": 60, "w": 40, "h": 25}
        }
    }

    def detect(self, file_path: str, file_type: str = "image", sample_preset: str = None) -> Dict[str, Any]:
        if sample_preset and sample_preset in self.PRESET_PROFILES:
            profile = self.PRESET_PROFILES[sample_preset]
            damage_type = profile["damage_type"]
            confidence = profile["confidence"]
            damage_area = profile["damage_area"]
            visual_severity = profile["visual_severity"]
            bbox = profile["bounding_box"]
        else:
            # Deterministic simulation based on filename string hash or random seed
            fn_hash = sum(ord(c) for c in os.path.basename(file_path)) if file_path else random.randint(1, 1000)
            rng = random.Random(fn_hash)
            
            damage_type = rng.choice(self.DAMAGE_TYPES)
            confidence = round(rng.uniform(0.82, 0.97), 2)
            damage_area = round(rng.uniform(0.8, 5.5), 1)
            visual_severity = round(rng.uniform(40.0, 95.0), 1)
            
            x = rng.randint(15, 35)
            y = rng.randint(20, 40)
            w = rng.randint(30, 50)
            h = rng.randint(25, 45)
            bbox = {"x": x, "y": y, "w": w, "h": h}

        return {
            "is_demo_mode": True,
            "notice": "DEMO AI MODE — Detection results are simulated unless a trained YOLO model is configured.",
            "damage_type": damage_type,
            "confidence": confidence,
            "damage_area": damage_area,
            "visual_severity": visual_severity,
            "bounding_box": json.dumps(bbox),
            "bounding_box_dict": bbox,
            "processed_frames": 1 if file_type == "image" else 24
        }


class YOLODetector(BaseDetector):
    """
    Placeholder class for real YOLOv8/YOLOv9 model integration.
    Replace model loading and inferencing logic here when trained weights (.pt / .onnx) are available.
    """

    def __init__(self, model_path: str = None):
        self.model_path = model_path
        self.is_loaded = False

    def detect(self, file_path: str, file_type: str = "image", sample_preset: str = None) -> Dict[str, Any]:
        if not self.is_loaded:
            # Fall back to DemoDetector if model weights are not provided
            demo = DemoDetector()
            res = demo.detect(file_path, file_type, sample_preset)
            res["notice"] = "YOLO Model weights not found. Falling back to Demo AI Mode."
            return res
        
        # Real YOLO inference logic would go here
        raise NotImplementedError("Trained YOLO model weights (.pt) are not configured.")


# Global AI Service instance getter
def get_ai_detector(mode: str = "demo") -> BaseDetector:
    if mode == "yolo":
        return YOLODetector()
    return DemoDetector()

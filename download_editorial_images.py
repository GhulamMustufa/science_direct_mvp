import urllib.request
import os

images = {
    "shah_ali_ul_qader": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-12-24-at-14.03.50-rgrw91oc49lzvtd7bnz9qnq57t299wv3sajavekafg.jpeg",
    "syed_a_aziz": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-09-14-at-8.34.32-PM-rbw924lykkotloyxxbua7xh7fe6hqnp0yvhuoy2tpk.jpeg",
    "bilquees_gul": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-09-29-at-6.10.47-PM-rcma21rqm959xnh174y30sp3i1u1qz30odsl2nf7xk.jpeg",
    "maqsood_ansari": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2026-02-28-at-19.56.31-rjwwtjshum2k0kvlp3a49qfzp815yzciew8jnh7f1k.jpeg",
    "hamida_nusrat": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2026-01-13-at-18.57.47-rhvqjra2phrbrc92fnv03pmaevpzzxrlz7e6zo7qaw.jpeg",
    "urszula_guzik": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/Screenshot-2025-10-05-235152-rcru28bg4jnhxyt26yei9ctssf1yw2b1lz351xn36w.jpg",
    "raffat_sultana": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/Untitled-design-6-rinonmj69m10auveueei495afylor54s2woteinl60.png",
    "zamin_shaheed_siddiqui": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-08-15-at-1.11.21-PM-racufdl3swnsxaa5wyrssm2wleiiqgvesggvacnvu0.jpeg",
    "tabassum_mahboob": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-09-17-at-8.43.14-PM-rbxm69ukib5b36n274ay18syzh7s1q3z2ds0lyfj6w.jpeg",
    "s_m_shahid": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-08-17-at-12.33.31-AM-racurvtsqjs5ei45vve3gygp4yvc5hiu6cyg5w4b1k.jpeg",
    "farah_jabeen": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-08-15-at-5.01.24-PM-racuf9tr1kinmufmix5ain127v11voghfxuxd8tgiw.jpeg",
    "shamim_a_qureshi": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-08-15-at-1.12.21-PM-racufbpff8l8a2cw7xyjnmjzemrsb2ny475wbsqo6g.jpeg",
    "afsheen_aman": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/Picture1-rac9cbyyw7l3hau57d4hsnlrcxqzxkim3j8cvc3ug8.png",
    "junaid_mahmood_alam": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-08-26-at-8.53.51-PM-rb27mlocxid5nn6moynlk5xpqips9w8hppn4e68n3c.jpeg",
    "qudsia_tariq": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-08-15-at-9.57.49-PM-racuf8vwuqhdb8gzoeqny59lmh5onzcr3t7fvyuup4.jpeg",
    "zaheer_ul_haq": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-08-15-at-1.12.53-PM-racufarl8ejxyge9dfjx34sit8wf3dk7s2ieuis2co.jpeg",
    "aliya_riaz": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-08-15-at-1.11.55-PM-racufcn9m2milobj2gd684bg00n5irrogbtdt2pa08.jpeg",
    "muhammad_asif_nawaz": "https://ijbahresearch.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2025-08-16-at-11.17.56-PM-racuf7y2nwg2zmictwc1dni513abga90rojyeow8vc.jpeg"
}

for name, url in images.items():
    ext = url.split('.')[-1]
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        data = urllib.request.urlopen(req).read()
        filepath = f"frontend/public/images/editorial/{name}.{ext}"
        with open(filepath, "wb") as f:
            f.write(data)
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")

import { Box, Container, Typography, Button, Stack } from "@mui/material";

import {
  Utensils,
  HandHeart,
  Truck,
  Store,
  HeartHandshake,
  ArrowRight,
  Mail,
  Leaf,
} from "lucide-react";

import ThemeSwitcher from "../../components/common/ThemeSwitcher";

const processSteps = [
  {
    icon: Utensils,
    title: "Restaurants Donate",
    description:
      "Restaurants list their surplus fresh food with quantity and pickup details.",
  },
  {
    icon: HandHeart,
    title: "NGOs Request",
    description:
      "Verified NGOs discover available donations and request the food they need.",
  },
  {
    icon: Truck,
    title: "Food Reaches People",
    description:
      "Approved donations are collected and distributed to communities.",
  },
];

const userTypes = [
  {
    icon: Store,
    title: "I'm a Restaurant",
    description:
      "Donate surplus food, manage donations and help reduce food waste.",
    button: "Join as Restaurant",
  },
  {
    icon: HeartHandshake,
    title: "I'm an NGO",
    description:
      "Discover available food donations and support your community.",
    button: "Join as NGO",
  },
];

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Get Started", href: "#get-started" },
];

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        overflow: "hidden",
      }}
    >
      {/* NAVIGATION */}
      <Box
        component="header"
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Utensils size={25} />

            <Typography variant="h5" fontWeight={800} color="primary">
              FoodLoop.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <ThemeSwitcher />
            </Box>

            <Button variant="text" color="primary">
              Login
            </Button>

            <Button variant="contained" color="primary">
              Register
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* HERO SECTION */}
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: { xs: "auto", md: "85vh" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
            py: { xs: 8, md: 10 },
          }}
        >
          {/* HERO CONTENT */}
          <Box sx={{ flex: 1 }}>
            <Typography
              color="primary"
              fontWeight={700}
              sx={{ mb: 2, letterSpacing: 2 }}
            >
              GOOD FOOD. SHARED BETTER.
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2.8rem",
                  md: "4.5rem",
                },
                lineHeight: 1.1,
                mb: 3,
              }}
            >
              Every meal deserves
              <Box component="span" color="primary.main">
                {" "}
                a purpose.
              </Box>
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 550,
                fontWeight: 400,
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              FoodLoop connects restaurants with surplus food to NGOs and
              communities that need it. Together, we can reduce food waste and
              create a meaningful impact.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button variant="contained" size="large" href="#get-started">
                Get Started
              </Button>

              <Button variant="outlined" size="large" href="#how-it-works">
                How It Works
              </Button>
            </Stack>
          </Box>

          {/* HERO VISUAL */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: 520,
              minHeight: 360,
              borderRadius: 5,
              bgcolor: "primary.main",
              color: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 5,
              textAlign: "center",
            }}
          >
            <HandHeart size={90} strokeWidth={1.5} />

            <Typography variant="h3" fontWeight={700} sx={{ mt: 3 }}>
              Share More.
              <br />
              Waste Less.
            </Typography>

            <Typography sx={{ mt: 2, opacity: 0.85 }}>
              One donation can make a difference.
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* HOW FOODLOOP WORKS */}
      <Box
        id="how-it-works"
        sx={{
          bgcolor: "background.paper",
          py: 10,
          scrollMarginTop: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Typography color="primary" fontWeight={700}>
              SIMPLE PROCESS
            </Typography>

            <Typography variant="h3" sx={{ mt: 2, mb: 2 }}>
              How FoodLoop Works
            </Typography>

            <Typography color="text.secondary">
              Three simple steps to turn surplus food into meaningful impact.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 4,
              mt:3
            }}
          >
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Box
                  key={step.title}
                  sx={{
                    p: 4,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 4,
                    bgcolor: "background.default",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: "primary.main",
                      bgcolor: "action.hover",
                      width: 65,
                      height: 65,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <Icon size={32} />
                  </Box>

                  <Typography color="primary" fontWeight={700}>
                    STEP 0{index + 1}
                  </Typography>

                  <Typography variant="h5" fontWeight={700} sx={{ my: 2 }}>
                    {step.title}
                  </Typography>

                  <Typography color="text.secondary" lineHeight={1.8}>
                    {step.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* GET STARTED */}
      <Box
        id="get-started"
        sx={{
          py: 10,
          scrollMarginTop: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography color="primary" fontWeight={700}>
              JOIN FOODLOOP
            </Typography>

            <Typography variant="h3" sx={{ mt: 2, mb: 2 }}>
              Be Part of the Change
            </Typography>

            <Typography color="text.secondary">
              Choose how you want to make a difference.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 4,
              mt:3
            }}
          >
            {userTypes.map((item) => {
              const Icon = item.icon;

              return (
                <Box
                  key={item.title}
                  sx={{
                    p: { xs: 3, md: 5 },
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 4,
                  }}
                >
                  <Box color="primary.main" mb={3}>
                    <Icon size={36} />
                  </Box>

                  <Typography variant="h4" fontWeight={700} mb={2}>
                    {item.title}
                  </Typography>

                  <Typography color="text.secondary" mb={4}>
                    {item.description}
                  </Typography>

                  <Button
                    variant="contained"
                    endIcon={<ArrowRight size={18} />}
                  >
                    {item.button}
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          bgcolor: "primary.main",
          color: "#FFFFFF",
          py: 7,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "2fr 1fr 1fr",
              },
              gap: 5,
            }}
          >
            {/* BRAND */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Leaf size={27} />

                <Typography variant="h5" fontWeight={800}>
                  FoodLoop.
                </Typography>
              </Stack>

              <Typography
                sx={{
                  opacity: 0.8,
                  maxWidth: 350,
                  lineHeight: 1.8,
                }}
              >
                Connecting surplus food with communities in need. Together,
                let's reduce food waste and make every meal count.
              </Typography>
            </Box>

            {/* QUICK LINKS */}
            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Quick Links
              </Typography>

              {quickLinks.map((link) => (
                <Typography
                  key={link.label}
                  component="a"
                  href={link.href}
                  display="block"
                  sx={{
                    color: "#FFFFFF",
                    opacity: 0.8,
                    textDecoration: "none",
                    mr:2,
                    mb: 1.5,
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>

            {/* CONTACT */}
            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Connect With Us
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Mail size={18} />

                  <Typography variant="body2">support@foodloop.com</Typography>
                </Stack>

                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Follow FoodLoop for updates and community initiatives.
                </Typography>
              </Stack>
            </Box>
          </Box>

          {/* COPYRIGHT */}
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.2)",
              mt: 6,
              pt: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              © {new Date().getFullYear()} FoodLoop. All rights reserved. Made
              with care for a better tomorrow.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

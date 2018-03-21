using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AjaxSelectableAutocomplete.Controllers
{
    public class DefaultController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
      
       
        public JsonResult SearchVenue(string keyw)
        {
            List<SimpleModel> sd = new List<SimpleModel>()
            {
                new SimpleModel{
                    locationCityID= 1767,
                    venueid = 369,
                    venueName ="Belexpo - 27, Yanka Kupala str.",
                    venueAddress = "<BR><B>Belexpo - 27, Yanka Kupala str.</B> <BR>27, Yanka Kupala str<BR>Minsk, 220035 <BR><B>Belarus</B>",
                    venueCountry= "Belarus",
                    venueCity= "Minsk" },

               new SimpleModel{ locationCityID= 1498,
venueid= 200,
venueName= "Angers Parc Expo",
venueAddress= "Angers Parc Expo Parc des Expositions 49480 Saint Sylvain dAnjou ",
venueCountry= "France",
venueCity= "Angers",},

new SimpleModel{
locationCityID = 1565,
venueid= 447,
venueName= "Annakirmesplatz",
venueAddress= "<BR><B>Annakirmesplatz</B> <BR>D-52349 Düren <BR><B>Germany</B>",
venueCountry= "Germany",
venueCity= "Düren",},


new SimpleModel{
locationCityID= 1666,
venueid= 705,
venueName= "Antalya Expo Centre",
venueAddress= "Antalya Expo Centre <br>Pinarli Beldesi <br>07110 Aksu",
venueCountry= "Turkey",
venueCity= "Antalya",},

new SimpleModel{
locationCityID= 2815,
venueid= 734,
venueName= "Ancona, Corso Garibaldi",
venueAddress= "<BR><B>Ancona, Corso Garibaldi</B> <BR>60121 Ancona (AN) <BR><B>Italy</B>",
venueCountry= "Italy",
venueCity= "Ancona",},

new SimpleModel{
locationCityID= 3733,
venueid= 923,
venueName= "Angelo Hotel Prague",
venueAddress= "<BR><B>Angelo Hotel Prague</B> <BR>Radlická 3216/1G<BR>150 00 Praha <BR><B>Czech Republic</B>",
venueCountry= "Czech Republic",
venueCity= "Prague",},

new SimpleModel{
locationCityID= 1933,
venueid= 1190,
venueName= "Anaheim Convention Center",
venueAddress= "800 W. Katella Ave. Anaheim, CA 92802",
venueCountry= "United States",
venueCity= "Anaheim",},

new SimpleModel{
locationCityID= 4109,
venueid= 1202,
venueName= "Annapolis City Dock",
venueAddress= "<BR><B>Annapolis City Dock</B> <BR>Dock St<BR>Annapolis, MD 21401 <BR><B>USA</B>",
venueCountry= "USA",
venueCity= "Annapolis, MD",},


new SimpleModel{
locationCityID= 4540,
venueid= 1536,
venueName= "Anoka Armory - Minnesota National Guard",
venueAddress= "<BR><B>Anoka Armory - Minnesota National Guard</B> <BR>408 E Main St<BR>Anoka, MN 55303 <BR><B>USA</B>",
venueCountry= "USA",
venueCity= "Roseville, MN",},



new SimpleModel{
locationCityID= 4050,
venueid= 1558,
venueName= "Antelope valley Fairgrounds",
venueAddress= "<BR><B>Antelope valley Fairgrounds</B> <BR>2551 W Avenue H<BR>Lancaster, CA 93536 <BR><B>USA</B>",
venueCountry= "USA",
venueCity= "Lancaster, CA",},


new SimpleModel{
locationCityID= 761,
venueid= 1733,
venueName= "Ana Intercontinental Hôtel",
venueAddress= "<BR><B>Ana Intercontinental Hôtel</B> <BR>1-12-33 Akasaka Minato-Ku<BR>Tokyo <BR><B>Japan</B>",
venueCountry= "Japan",
venueCity= "Tokyo",},


new SimpleModel{
locationCityID= 911,
venueid= 1776,
venueName= "Angkor Coex",
venueAddress= "<BR><B>Angkor Coex</B> <BR>Borey Vapathor Village<BR>Sangkat Slor Kram<BR>Siem Reap City <BR><B>Cambodia</B>",
venueCountry= "Cambodia",
venueCity= "Siem Reap", },

                };

            return Json(new { result = sd.Where(x => x.venueName.Contains(keyw)).ToList() }, JsonRequestBehavior.AllowGet);
        }
    }
    public class SimpleModel {
        public int locationCityID { get; set; }
        public int venueid { get; set; }
        public string venueName { get; set; }
        public string venueAddress { get; set; }
        public string venueCountry { get; set; }
        public string venueCity { get; set; }
    }
}
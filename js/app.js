
/*
 * Global Configs and trigger
 */




$(function(){
	createBambooProjects();
	createJenkinsProjects();
	
	getAwsServices();
	startRefresh();
	
});


function startRefresh() {
    setTimeout(function(){
    	startRefresh();
		findAwsBuilds();
		getJenkinsBuilds();
		getServiceStatus();
	}, refreshRate);
    
}


/*******************************
 *
 * CI functions
 * 
 * 
 ******************************/

var queryParams = "?os_authType=basic&os_username="+bambooUsername+"&os_password="+bambooPassword;

function createBambooProjects(){
	$.ajax({
        url: 'includes/bamboo.php?action=getBambooProjects',
        dataType: "json",
        success: function(response){
			$.each(response, function( index, value ) {
			  createBambooProject(index, value);
			});
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    },
	    complete: function(){   	
	    	findAwsBuilds();
	    	
	    }
    });
}
	

function createJenkinsProjects(){
	$.ajax({
        url: 'includes/jenkins.php?action=getjenkinsProjects',
        dataType: "json",
        success: function(response){
			$.each(response, function(project, value) {
			  createJenkinsProject(project, value, response);
			});
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    },
	    complete: function(){   	
	    	findAwsBuilds();
	    	getJenkinsBuilds();
	    	
	    }
	    
    });
}

function createBambooProject(project, value){

	pk = value.bambooProjectKey;
	sk = value.bambooShortKey;
	awsProject = value.awsApplicationName;

	columns = $(document.createElement("div")).addClass('large-6 columns anchorWrapper');
	anchor = $(document.createElement("a")).attr('href','');
	project = $(document.createElement("div")).addClass('project fade').attr('id',project).attr('data-bambooProjectKey',pk).attr('data-bambooShortKey',sk).attr('data-aws-project', awsProject);
	projectTitle = project.attr('id');
	projectName = $(document.createElement("div")).addClass('large-10 columns').text(projectTitle);
	projectStatus = $(document.createElement("div")).addClass('large-2 columns options');
	
	project.append(projectName);
	project.append(projectStatus);
	columns.append(anchor);
	columns.append(project);
	$('#bambooProjects .row').append(columns);
	
}

function createJenkinsProject(job, value, response){
	
	server = job;
	job = value.job;
	
	$.each(job, function(key, val) {
		jobKey = val.jobKey;
		awsProject = val.awsApplicationName;
		
		columns = $(document.createElement("div")).addClass('large-6 columns anchorWrapper');
		anchor = $(document.createElement("a")).attr('href','');
		job = $(document.createElement("div")).addClass('project fade jenkins').attr('id',jobKey).attr('data-jenkins-server',server).attr('data-aws-project', awsProject);
		jobTitle = job.attr('id');
		jobName = $(document.createElement("div")).addClass('large-10 columns').text(jobTitle);
		jobStatus = $(document.createElement("div")).addClass('large-2 columns options');
		
		job.append(jobName);
		job.append(jobStatus);
		columns.append(anchor);
		columns.append(job);
		$('#bambooProjects .row').append(columns);
	});
}


function getBambooBuilds(){
	$('.project').each(function() {
	  projectName = $( this ).attr('id');
	  bambooProjectKey = $( this ).attr('data-bambooprojectkey');
	  bambooShortKey = $( this ).attr('data-bambooShortKey');
	  if(bambooProjectKey){
	  	projectName != undefined ? getCurrentStatus(projectName, bambooProjectKey, bambooShortKey) : '';
	  }
	});
}

function getJenkinsBuilds(){
	$('.project.jenkins').each(function() {
	  jobName = $( this ).attr('id');
	  serverName = $(this).attr('data-jenkins-server');
	  if(jobName.length){
	  	jobName != undefined ? getCurrentJenkinsStatus(jobName, serverName) : '';
	  }
	});
}

function findAwsBuilds(){
	$('.project').each(function() {
	  awsProject = $( this ).attr('data-aws-project');	  
	  awsProject != undefined ? getAwsBuilding(awsProject) : '';
	});
}

function getAwsBuilding(awsProject){
	$.ajax({
        url: 'includes/aws.php?action=describeEnvironments&applicationName='+awsProject,
        dataType: "json",
        success: function(response){
			showAwsStatus(response);
			
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });
}

function showAwsStatus(response){

	app = response.Environments[0];

	var appCard = $('[data-aws-project="'+app.ApplicationName+'"]');
	if(app.Health === 'Gray' || app.Health === 'Grey'){
		if(!appCard.hasClass('updating')){			
			var awsCard = $('[data-aws-project="'+app.ApplicationName+'"] .large-2');	
			appCard.find('.options div, .options i').remove();
			uploading = $(document.createElement("i")).addClass('icon-cloud-upload right animated fadeInUp');
			appCard.removeClass().addClass('project fade updating')
			awsCard.append(uploading);
		}
	}else if(app.Health === 'Red'){
		appCard.removeClass().addClass('project fade failed');
	}else if(app.Health === 'Yellow'){
		appCard.removeClass().addClass('project fade info');
	}else if(app.Health === 'Green'){
		//appCard.find('.options div').remove();
		appCard.find('.options i.icon-cloud-upload').remove();
		appCard.removeClass('updating');
		getBambooBuilds();
		getJenkinsBuilds();
	}else if(appCard.hasClass('jenkins')){
		getJenkinsBuilds();
	}
	
	
//Find colors here: http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.healthstatus.html
}



function getCurrentStatus(projectName, bambooProjectKey, bambooShortKey){

    $.ajax({
        url: 'includes/bamboo.php?action=getBambooBuilds&projectName='+projectName+'&bambooProjectKey='+ bambooProjectKey +'&bambooShortKey='+ bambooShortKey,
        dataType: "json",
        success: function(response){
			buildStatus(response);
			//createLink(response);
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });

}


function getCurrentJenkinsStatus(jobName, serverName){

    $.ajax({
        url: 'includes/jenkins.php?action=getCurrentJenkinsStatus&jobName='+jobName+'&serverName='+serverName,
        dataType: "json",
        success: function(response){
			showJenkinsBuildResults(response);
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });

}

function buildStatus(response){
	response.isBuilding === true ? changeStatusBuilding(response) : getBambooBuildResults(response);
}

function changeStatusBuilding(response){
	var shortKeyRow = $("[data-bambooshortkey='"+response.shortKey+"']");
	if(!shortKeyRow.hasClass('building') && !shortKeyRow.hasClass('updating')){
	
		buildingLoader = $(document.createElement("div")).addClass('right buildingIcon');
		shortKeyRow.addClass('building fade');
		$("[data-bambooshortkey='"+response.shortKey+"'] .options").append(buildingLoader);
	}	
	
}


function getBambooBuildResults(response){
	projectName = response.projectName;
	bambooProjectKey = response.projectKey;
	bambooShortKey = response.shortKey;
	
	
    $.ajax({
        url: 'includes/bamboo.php?action=getBambooBuildResults&projectName='+projectName+'&bambooProjectKey='+ bambooProjectKey +'&bambooShortKey='+ bambooShortKey,
        dataType: "json",
        success: function(response){
			showBambooBuildResults(response, bambooProjectKey, bambooShortKey);
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });
}

function showBambooBuildResults(response, bambooProjectKey, bambooShortKey){
	if(response.results.result[0]){
		state = response.results.result[0].state;
		$('.row').find("[data-bambooshortkey='"+bambooShortKey +"']").removeClass('building updating');
		$('.row').find("[data-bambooshortkey='"+bambooShortKey +"'] .options div").remove();
		$('.row').find("[data-bambooshortkey='"+bambooShortKey +"'] .options i").remove();
		
		if(state === 'Failed'){
			if(!$('.row').find("[data-bambooshortkey='"+bambooShortKey +"']").hasClass('failed')){
				playAlert();
			}			
			$('.row').find("[data-bambooshortkey='"+bambooShortKey +"']").removeClass().addClass('project failed fade');
		}else if(state === "Successful"){
			$('.row').find("[data-bambooshortkey='"+bambooShortKey +"']").removeClass().addClass('project success fade');
		}
	}
}
function showJenkinsBuildResults(response){
	var jenkinsJobRow = $('.row').find("#"+response.displayName);
	if(response && !jenkinsJobRow.hasClass('updating')){
		state = response.color;

		jenkinsJobRow.removeClass('building');
		$('.row').find("#"+response.displayName+" .options div").remove();
		$('.row').find("#"+response.displayName+" .options i").remove();
		
		if(state === 'red'){
			if(!jenkinsJobRow.hasClass('failed')){
				playAlert();
			}			
			jenkinsJobRow.removeClass().addClass('project fade failed');
		}else if(state === 'blue_anime' || state === "red_anime"){
			if(!jenkinsJobRow.hasClass('building')){
	
				buildingLoader = $(document.createElement("div")).addClass('right buildingIcon');
				jenkinsJobRow.removeClass().addClass('project building fade');
				jenkinsJobRow.find('.options').append(buildingLoader);
			}
		}else if(state === "yellow"){
			jenkinsJobRow.removeClass().addClass('project info fade');
		}else if(state === "blue"){
			jenkinsJobRow.removeClass().addClass('project success fade');
		}
	}
}



/******************************
 * 
 * AWS Service Feeds
 * 
 ******************************/


function getAwsServices(){
	$.ajax({
        url: 'includes/aws-status.php?action=getServices',
        dataType: "json",
        success: function(response){
			$.each(response, function( index, value ) {
			 createService(index, value);
			});
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    },
	    complete: function(){
	    	getServiceStatus();
	    	
	    }
    });
}

function createService(service, value){

	columns = $(document.createElement("div")).addClass('large-6 columns anchorWrapper');
	//anchor = $(document.createElement("a")).attr('href','');
	service = $(document.createElement("div")).addClass('service fade').attr('id',service).attr('data-aws-service',value);
	serviceTitle = service.attr('id');
	serviceName = $(document.createElement("div")).addClass('large-10 columns').text(serviceTitle);
	serviceStatus = $(document.createElement("div")).addClass('large-2 columns options');
	
	service.append(serviceName);
	service.append(serviceStatus);
	//columns.append(anchor);
	columns.append(service);
	$('#awsStatus .row').append(columns);
	
}

function getServiceStatus(){
	$('.service').each(function() {
	  serviceName = $( this ).attr('id');
	  serviceKey = $( this ).attr('data-aws-service');

	  
	  serviceName != undefined ? showServiceStatus(serviceName, serviceKey) : '';
	});
}

function showServiceStatus(serviceName, serviceKey){

    $.ajax({
        url: 'includes/aws-status.php?action=getServiceFeed&serviceKey='+serviceKey,
        dataType: "json",
        success: function(response){
			attachServiceStatus(response, serviceName, serviceKey);
        },

	    error: function (request, textStatus, errorThrown) {
	        console.log(request);
	    }
    });

}
function attachServiceStatus(response, serviceName, serviceKey){
	if(response.item[0]){
		state = response.item[0].title;
		description = response.item[1].description;
		
		serviceRow = $('#awsStatus .row').find("[data-aws-service='"+serviceKey +"']");
		$('#awsStatus .row').find("[data-aws-service='"+serviceKey +"'] .large-10").text(response.title);
		serviceRow.attr('title',state);
		
		if (state.indexOf("[RESOLVED]") >= 0 || description.indexOf("resolved") >= 0){
			serviceRow.removeClass().addClass('service fade up');
		}else if(state.indexOf("Informational message:") >= 0){
			serviceRow.removeClass().addClass('service fade info');
		}else{
			if(!serviceRow.hasClass('down')){
				playAlert();
			}
			
			serviceRow.removeClass().addClass('service fade down');
		}
	}else{
		serviceRow.removeClass('up, down, info');
	}
}